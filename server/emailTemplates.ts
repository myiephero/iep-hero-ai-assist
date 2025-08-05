import { Resend } from 'resend';
import type { AdvocateMatch } from '@shared/schema';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdvocateNotification(match: AdvocateMatch, advocateEmail: string, advocateName: string) {
  const helpAreasFormatted = match.helpAreas.map(area => `[✓ ${area}]`).join('\n');
  
  const documentsSection = match.documentUrls && match.documentUrls.length > 0 
    ? `📎 Documents:\n${match.documentUrls.map((url, i) => `\t• Attachment ${i + 1}: ${url}`).join('\n')}`
    : '📎 Documents:\n\t• No documents uploaded';

  const emailBody = `Hi ${advocateName},

You've been matched with a new Hero Plan parent who is seeking support with their child's IEP process. Below are the intake details:

⸻

👨‍👩‍👧 Parent Information:
\t• Child Grade Level: ${match.gradeLevel}
\t• School District: ${match.schoolDistrict}

⸻

🧩 Parent Needs:
\t• Help Areas Selected:
${helpAreasFormatted}
\t• Biggest Concern:
"${match.concerns}"
\t• Next IEP Meeting: ${match.meetingDate || 'Not scheduled'}
\t• Preferred Contact Method: ${match.contactMethod}
\t• Availability: ${match.parentAvailability}

⸻

${documentsSection}

⸻

🔗 Book a Call:
Please coordinate scheduling directly with the parent based on their availability.

⸻

Please review their intake info and confirm the meeting time. Let us know if you need help accessing any documents or preparing for the call.

Thanks for being a Hero!
– The IEP Hero Team`;

  try {
    const result = await resend.emails.send({
      from: 'IEP Hero <noreply@iephero.com>',
      to: [advocateEmail],
      subject: `🆕 New Parent Match Assigned – Parent Needs Help`,
      text: emailBody,
    });

    console.log('Advocate notification sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send advocate notification:', error);
    throw error;
  }
}

export async function sendParentConfirmation(match: AdvocateMatch, parentEmail: string) {
  const emailBody = `Hi there,

Great news! We've successfully matched you with an expert IEP advocate who specializes in helping families like yours.

⸻

✅ What Happens Next:

1. Your advocate will review your intake information within 24 hours
2. You'll receive an email with their contact information and scheduling link
3. You'll have your first consultation call to discuss your situation
4. Your advocate will create a personalized action plan for your child's IEP

⸻

📋 Your Submitted Information:

\t• Child's Grade: ${match.gradeLevel}
\t• School District: ${match.schoolDistrict}
\t• Help Areas: ${match.helpAreas.join(', ')}
\t• Preferred Contact: ${match.contactMethod}

⸻

💡 While You Wait:

• Gather any IEP documents, evaluations, or school communications
• Think about specific questions you want to ask your advocate
• Review your child's current IEP goals and services

⸻

Questions? Reply to this email or contact our support team.

Thanks for being a Hero Family!
– The IEP Hero Team`;

  try {
    const result = await resend.emails.send({
      from: 'IEP Hero <noreply@iephero.com>',
      to: [parentEmail],
      subject: '✅ Your IEP Advocate Match is Confirmed!',
      text: emailBody,
    });

    console.log('Parent confirmation sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send parent confirmation:', error);
    throw error;
  }
}