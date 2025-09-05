import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generic send mail function
export async function sendEmail({ to, subject, html }) {
  try {
    let info = await transporter.sendMail({
      from: `"LawEdu" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Optionally handle errors/logging as needed
  }
}

// Send enrollment confirmation email
export async function sendEnrollmentEmail(to, courseTitle, appointmentDate) {
  const subject = `Enrollment Confirmed for ${courseTitle}`;
  const html = `
    <h3>Hello,</h3>
    <p>Your enrollment for the course <strong>${courseTitle}</strong> is confirmed.</p>
    <p>Your scheduled appointment is on <strong>${new Date(appointmentDate).toLocaleString()}</strong>.</p>
    <p>Thank you for choosing LawEdu!</p>
  `;
  await sendEmail({ to, subject, html });
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(to, course, amount) {
  const subject = `Payment Received for ${course.title}`;
  const html = `
    <h3>Hello,</h3>
    <p>We have received your payment of <strong>₹${amount}</strong> for the course <strong>${course.title}</strong>.</p>
    <p>Thank you for your payment. You can now access your course and schedule.</p>
    <p>Best regards,<br/>LawEdu Team</p>
  `;
  await sendEmail({ to, subject, html });
}
