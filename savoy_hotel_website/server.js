require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'reservations@savoyhotelmanila.com',
      subject: 'New Contact Form Submission',
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

app.post('/api/booking/check-availability', async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.body;
    
    // Here you would typically check a database for room availability
    // For now, we'll simulate a response
    const isAvailable = Math.random() > 0.3; // 70% chance of availability
    
    if (isAvailable) {
      res.json({
        success: true,
        message: 'Rooms available for selected dates',
        rooms: [
          {
            type: 'Suite',
            price: 8500,
            available: 2
          },
          {
            type: 'Deluxe Premier',
            price: 6500,
            available: 3
          }
        ]
      });
    } else {
      res.json({
        success: false,
        message: 'No rooms available for selected dates'
      });
    }
  } catch (error) {
    console.error('Booking check error:', error);
    res.status(500).json({ success: false, message: 'Error checking availability' });
  }
});

app.post('/api/booking/submit', async (req, res) => {
  try {
    const { checkIn, checkOut, guests, roomType, name, email, phone } = req.body;

    // Here you would typically save the booking to a database
    // For now, we'll just send a confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Confirmation - Savoy Hotel Manila',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for choosing Savoy Hotel Manila. Your booking has been received.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li>Check-in: ${checkIn}</li>
          <li>Check-out: ${checkOut}</li>
          <li>Guests: ${guests}</li>
          <li>Room Type: ${roomType}</li>
        </ul>
        <p>We will contact you shortly to confirm your booking.</p>
        <p>Best regards,<br>Savoy Hotel Manila Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Booking submitted successfully! A confirmation email has been sent.'
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).json({ success: false, message: 'Error submitting booking' });
  }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 