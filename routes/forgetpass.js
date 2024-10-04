const express = require("express");
const crypto = require("crypto");
const User = require("../models/users");
const nodemailer = require("nodemailer");

const router = express.Router();

// Generate Reset Token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Route for password reset request
router.post("/forgot-password", async (req, res) => {
  console.log("Received request for password reset");
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User with this email does not exist.");
    }

    const resetToken = generateResetToken();
    const tokenExpiration = Date.now() + 3600000; // 1 hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    const resetLink = `https://silk-route-backend.onrender.com/reset-password/${resetToken}`;

    await sendResetEmail(user.email, resetLink);

    res.status(200).send("Password reset link sent.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// Nodemailer functionality
const sendResetEmail = async (email, resetLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Silk Route Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "Password Reset - Silk Route",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 40px; border-radius: 10px; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <div style="text-align: center;">
              <img src="https://i.imghippo.com/files/3gqWV1727590046.jpg" alt="Silk Route Logo" style="width: 40px;  margin-bottom: 20px;" />
              <h2 style="color: #333; font-size: 24px; font-weight: bold; margin: 0;">Password Reset Request</h2>
              <p style="color: #666; font-size: 16px; margin: 20px 0;">We’re here to help you get back into your account.</p>
            </div>

            <div style="padding-top: 20px;">
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Hello,
                <br /><br />
                It looks like you requested to reset your password for your <strong>Silk Route</strong> account. Click the button below to reset it:
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 14px 28px; border-radius: 6px; font-size: 16px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Reset Your Password
                </a>
              </div>

              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                If you did not request a password reset, please ignore this email, and your password will remain unchanged.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />

            <div style="text-align: center;">
              <p style="font-size: 14px; color: #777;">
                Best regards,<br />
                <strong>Silk Route Team</strong><br />
                By Ujjwal and Simran
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999;">
              You’re receiving this email because you requested a password reset for your Silk Route account. If this wasn’t you, you can safely ignore this email.
            </p>

        

            <p style="font-size: 12px; color: #999;">Silk Route, All rights reserved © 2024</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", email);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send reset email");
  }
};

module.exports = router;
