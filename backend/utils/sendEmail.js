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

// Send booking confirmation email
export async function sendBookingConfirmationEmail(booking) {
  const subject = `Booking Confirmed with ${booking.instructor.user.name}`;
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        .email-container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f8f9fa; }
        .booking-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .confirmation-number { background-color: #10B981; color: white; padding: 10px 15px; border-radius: 5px; font-weight: bold; text-align: center; margin: 20px 0; }
        .footer { background-color: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎓 LawEdu</h1>
          <h2>Booking Confirmation</h2>
        </div>
        
        <div class="content">
          <h3>Hello ${booking.user.name},</h3>
          <p>Your appointment with <strong>${booking.instructor.user.name}</strong> has been confirmed!</p>
          
          <div class="confirmation-number">
            Confirmation Number: ${booking.confirmationNumber}
          </div>
          
          <div class="booking-details">
            <h4>📅 Appointment Details</h4>
            <div class="detail-row">
              <span><strong>Instructor:</strong></span>
              <span>${booking.instructor.user.name}</span>
            </div>
            <div class="detail-row">
              <span><strong>Date:</strong></span>
              <span>${bookingDate}</span>
            </div>
            <div class="detail-row">
              <span><strong>Time:</strong></span>
              <span>${booking.startTime} - ${booking.endTime}</span>
            </div>
            <div class="detail-row">
              <span><strong>Duration:</strong></span>
              <span>${booking.duration} minutes</span>
            </div>
            <div class="detail-row">
              <span><strong>Session Type:</strong></span>
              <span>${booking.sessionType}</span>
            </div>
            <div class="detail-row">
              <span><strong>Meeting Type:</strong></span>
              <span>${booking.meetingType}</span>
            </div>
            ${booking.meetingUrl ? `
            <div class="detail-row">
              <span><strong>Meeting Link:</strong></span>
              <span><a href="${booking.meetingUrl}">${booking.meetingUrl}</a></span>
            </div>
            ` : ''}
            ${booking.meetingLocation ? `
            <div class="detail-row">
              <span><strong>Location:</strong></span>
              <span>${booking.meetingLocation}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span><strong>Amount:</strong></span>
              <span>₹${booking.amount}</span>
            </div>
          </div>
          
          <h4>📋 Next Steps:</h4>
          <ul>
            <li>Save your confirmation number: <strong>${booking.confirmationNumber}</strong></li>
            <li>Join the session at the scheduled time</li>
            <li>Prepare any questions or materials you'd like to discuss</li>
            <li>Contact us if you need to reschedule (at least 24 hours in advance)</li>
          </ul>
          
          <p><strong>Need help?</strong> Contact our support team or reply to this email.</p>
        </div>
        
        <div class="footer">
          <p>© 2024 LawEdu. All rights reserved.</p>
          <p>Excellence in Legal Education</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({ 
    to: booking.user.email, 
    subject, 
    html 
  });
  
  // Also send notification to instructor
  const instructorSubject = `New Booking: ${booking.user.name}`;
  const instructorHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h3>Hello ${booking.instructor.user.name},</h3>
      <p>You have a new booking confirmed:</p>
      <ul>
        <li><strong>Student:</strong> ${booking.user.name}</li>
        <li><strong>Date:</strong> ${bookingDate}</li>
        <li><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</li>
        <li><strong>Session:</strong> ${booking.sessionType}</li>
        <li><strong>Confirmation:</strong> ${booking.confirmationNumber}</li>
      </ul>
      <p>Please prepare for the session and contact the student if needed.</p>
      <p>Best regards,<br/>LawEdu Team</p>
    </div>
  `;
  
  await sendEmail({ 
    to: booking.instructor.user.email, 
    subject: instructorSubject, 
    html: instructorHtml 
  });
}

// Send booking update email
export async function sendBookingUpdateEmail(booking, newStatus) {
  const statusMessages = {
    confirmed: 'Your booking has been confirmed',
    cancelled: 'Your booking has been cancelled',
    completed: 'Your session has been marked as completed',
    'no-show': 'Your session was marked as no-show'
  };
  
  const subject = `Booking Update: ${statusMessages[newStatus]}`;
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h3>Hello ${booking.user.name},</h3>
      <p>${statusMessages[newStatus]} with <strong>${booking.instructor.user.name}</strong>.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h4>Booking Details:</h4>
        <p><strong>Confirmation Number:</strong> ${booking.confirmationNumber}</p>
        <p><strong>Date:</strong> ${bookingDate}</p>
        <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
        <p><strong>Status:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
        ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
      </div>
      
      ${newStatus === 'completed' ? `
        <p>We hope you had a great session! Please consider leaving a review to help other students.</p>
      ` : ''}
      
      ${newStatus === 'cancelled' ? `
        <p>If you'd like to reschedule, please book a new session through our platform.</p>
      ` : ''}
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      <p>Best regards,<br/>LawEdu Team</p>
    </div>
  `;
  
  await sendEmail({ 
    to: booking.user.email, 
    subject, 
    html 
  });
}
