import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { CheckCircle, FileText, Users, Scale, TrendingUp, GraduationCap, Phone, Shield, Lock, RotateCcw, Award } from "lucide-react";

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Expert IEP Advocacy
              <span className="text-primary block">for Your Child's Success</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Professional guidance and advocacy services to help you navigate the IEP process, 
              ensure your child receives appropriate educational services, and protect their rights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => scrollToSection('pricing')}
              >
                View Plans & Pricing
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4"
              >
                <i className="fas fa-play mr-2"></i>
                Watch Overview
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive IEP Support Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial evaluations to ongoing advocacy, we provide expert guidance 
              at every step of your child's educational journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">IEP Development</h3>
                <p className="text-gray-600">Expert assistance in creating comprehensive IEPs that address your child's unique needs and educational goals.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Meeting Advocacy</h3>
                <p className="text-gray-600">Professional representation during IEP meetings to ensure your voice is heard and your child's needs are met.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Guidance</h3>
                <p className="text-gray-600">Understanding your rights under IDEA and Section 504, with referrals to specialized attorneys when needed.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Progress Monitoring</h3>
                <p className="text-gray-600">Ongoing review of your child's progress and IEP implementation to ensure goals are being met effectively.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transition Planning</h3>
                <p className="text-gray-600">Support for educational transitions including school changes, grade transitions, and post-secondary planning.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600">Access to expert guidance when you need it most, with emergency consultation available for urgent situations.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Advocacy Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional IEP advocacy services tailored to your needs. 
              Cancel anytime with no long-term commitments.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Parent Basic Plan */}
            <Card className="shadow-lg border border-gray-200 relative">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Parent Basic</h3>
                  <p className="text-gray-600 mb-4">Essential support for involved parents</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">$19</span>
                    <span className="text-xl text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Billed monthly • Cancel anytime</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Monthly 1-hour consultation call</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Email support within 48 hours</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Access to resource library</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">IEP template and checklist tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Basic rights and law guidance</span>
                  </li>
                </ul>

                <Button 
                  className="w-full py-4 text-lg"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Start Parent Basic
                </Button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  Perfect for parents who want expert guidance and support
                </p>
              </CardContent>
            </Card>

            {/* Advocate Pro Plan */}
            <Card className="shadow-xl border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Advocate Pro</h3>
                  <p className="text-gray-600 mb-4">Comprehensive advocacy services</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-gray-900">$75</span>
                    <span className="text-xl text-gray-600 ml-1">/month</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Billed monthly • Cancel anytime</p>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700"><strong>Everything in Parent Basic, plus:</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Weekly 1-hour consultation calls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Priority email support (24-hour response)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">IEP meeting preparation and attendance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Document review and drafting support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Emergency consultation hotline</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-green-600 mt-1 mr-3 h-5 w-5" />
                    <span className="text-gray-700">Legal referral network access</span>
                  </li>
                </ul>

                <Button 
                  className="w-full py-4 text-lg"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Start Advocate Pro
                </Button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  Ideal for complex cases requiring intensive advocacy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
              <div className="flex items-center">
                <Shield className="text-green-600 mr-2 h-5 w-5" />
                <span className="text-sm">Secure Payment Processing</span>
              </div>
              <div className="flex items-center">
                <Lock className="text-green-600 mr-2 h-5 w-5" />
                <span className="text-sm">Privacy Protected</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="text-green-600 mr-2 h-5 w-5" />
                <span className="text-sm">Cancel Anytime</span>
              </div>
              <div className="flex items-center">
                <Award className="text-green-600 mr-2 h-5 w-5" />
                <span className="text-sm">Licensed Advocates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Parents Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from families who have successfully navigated the IEP process with our support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The advocate helped us understand our rights and ensured our daughter received the services she needed. The IEP meeting went smoothly with their guidance."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold">SM</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                    <p className="text-sm text-gray-600">Parent, California</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "Professional, knowledgeable, and truly caring. They helped us through a complex situation and my son is now getting the support he deserves."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-semibold">MR</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael R.</h4>
                    <p className="text-sm text-gray-600">Parent, Texas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "The monthly calls are invaluable. Having an expert to discuss concerns and strategies with has made all the difference in our advocacy efforts."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-semibold">JL</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Jennifer L.</h4>
                    <p className="text-sm text-gray-600">Parent, Florida</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our IEP advocacy services.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What qualifications do your advocates have?",
                answer: "Our advocates are licensed professionals with advanced degrees in special education, educational law, or related fields. All have extensive experience working within school systems and advocating for students with disabilities."
              },
              {
                question: "Can I cancel my subscription at any time?",
                answer: "Yes, you can cancel your subscription at any time with no penalties or fees. Your access will continue until the end of your current billing period."
              },
              {
                question: "Do you provide services in all states?",
                answer: "Yes, we provide advocacy services nationwide. Federal special education laws (IDEA and Section 504) apply across all states, and our advocates are knowledgeable about state-specific regulations."
              },
              {
                question: "What happens during an IEP meeting with your advocate?",
                answer: "Our advocate will attend the meeting with you, help present your child's needs clearly, ensure all required elements are addressed, and help negotiate appropriate services and accommodations. We prepare you beforehand and provide follow-up support."
              }
            ].map((faq, index) => (
              <Card key={index} className="shadow-sm border border-gray-200">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <span className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
