import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY. Please get it from https://dashboard.stripe.com/apikeys');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve subscribe.html
  app.get('/subscribe.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../subscribe.html'));
  });

  // Create Stripe checkout session for subscribe.html
  app.post('/create-checkout-session', async (req, res) => {
    try {
      const { userId, plan } = req.body;
      
      // Map plan names to price IDs
      const priceMapping: { [key: string]: string } = {
        'parent_basic': process.env.STRIPE_PARENT_BASIC_PRICE_ID || 'price_parent_basic',
        'advocate_pro': process.env.STRIPE_ADVOCATE_PRO_PRICE_ID || 'price_advocate_pro'
      };

      const priceId = priceMapping[plan];
      if (!priceId) {
        return res.status(400).json({ error: 'Invalid plan selected' });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.protocol}://${req.get('host')}/success.html`,
        cancel_url: `${req.protocol}://${req.get('host')}/subscribe.html`,
        client_reference_id: userId,
      });

      res.json({ sessionId: session.id });
    } catch (error: any) {
      console.error('Checkout session error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create subscription for a specific plan
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const { plan } = req.body;
      const userId = req.user.claims.sub;
      const userEmail = req.user.claims.email;
      const userName = req.user.claims.first_name || req.user.claims.email;

      const validPlans = [
        'parent-basic', 'parent-premium', 'parent-pro',
        'advocate-standard', 'advocate-premium', 'advocate-enterprise'
      ];
      
      if (!plan || !validPlans.includes(plan)) {
        return res.status(400).json({ message: 'Invalid plan selected' });
      }

      let user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (subscription.status === 'active') {
          const latestInvoice = typeof subscription.latest_invoice === 'string' 
            ? await stripe.invoices.retrieve(subscription.latest_invoice, { expand: ['payment_intent'] })
            : subscription.latest_invoice;
          const paymentIntent = latestInvoice && (latestInvoice as any).payment_intent 
            ? (latestInvoice as any).payment_intent
            : null;
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: paymentIntent?.client_secret || null,
          });
        }
      }

      // Create Stripe customer if needed
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
          metadata: { userId },
        });
        customerId = customer.id;
      }

      // Set price based on plan
      const priceMapping = {
        'parent-basic': process.env.STRIPE_PARENT_BASIC_PRICE_ID || 'price_parent_basic',
        'parent-premium': process.env.STRIPE_PARENT_PREMIUM_PRICE_ID || 'price_parent_premium',
        'parent-pro': process.env.STRIPE_PARENT_PRO_PRICE_ID || 'price_parent_pro',
        'advocate-standard': process.env.STRIPE_ADVOCATE_STANDARD_PRICE_ID || 'price_advocate_standard',
        'advocate-premium': process.env.STRIPE_ADVOCATE_PREMIUM_PRICE_ID || 'price_advocate_premium',
        'advocate-enterprise': process.env.STRIPE_ADVOCATE_ENTERPRISE_PRICE_ID || 'price_advocate_enterprise',
      };
      const priceId = priceMapping[plan as keyof typeof priceMapping];

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
        metadata: { userId, plan },
      });

      // Update user with Stripe info
      await storage.updateUserStripeInfo(userId, customerId, subscription.id);
      await storage.updateUserSubscription(userId, plan, subscription.status);

      const latestInvoice = typeof subscription.latest_invoice === 'string' 
        ? await stripe.invoices.retrieve(subscription.latest_invoice, { expand: ['payment_intent'] })
        : subscription.latest_invoice;
      const paymentIntent = latestInvoice && (latestInvoice as any).payment_intent 
        ? (latestInvoice as any).payment_intent
        : null;
      
      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret || null,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe webhook to handle subscription updates
  app.post('/api/stripe-webhook', async (req, res) => {
    try {
      const event = req.body;

      switch (event.type) {
        case 'invoice.payment_succeeded':
          const subscriptionId = event.data.object.subscription;
          const customerId = event.data.object.customer;
          
          // Find user by customer ID and update subscription status
          const userList = await db.select().from(users).where(eq(users.stripeCustomerId, customerId));
          if (userList.length > 0) {
            await storage.updateUserSubscription(userList[0].id, userList[0].subscriptionPlan!, 'active');
          }
          break;

        case 'customer.subscription.deleted':
          const deletedSubscription = event.data.object;
          const deletedCustomerId = deletedSubscription.customer;
          
          const deletedUserList = await db.select().from(users).where(eq(users.stripeCustomerId, deletedCustomerId));
          if (deletedUserList.length > 0) {
            await storage.updateUserSubscription(deletedUserList[0].id, deletedUserList[0].subscriptionPlan!, 'canceled');
          }
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({ message: 'Webhook error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
