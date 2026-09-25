import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/User.js";

dotenv.config();


// =====================================================
// ENVIRONMENT CONFIGURATION
// =====================================================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.LEGACY_JWT_SECRET ||
  "hfgbdgteyhgdfsavdfertfhngjuythfjndjdkdmedkdoeoemnhgfytrgegdgsh";

// Frontend URL
// Local: http://localhost:5173
// Production: set CLIENT_URL in Render
const FRONTEND_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

// Backend URL
// Local: http://localhost:5000
// Production: set BACKEND_URL in Render
const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000";


// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// =====================================================
// SEND VERIFICATION EMAIL
// =====================================================

const sendVerificationEmail = async (user, token) => {
  const verifyUrl =
    `${BACKEND_URL}/api/user/verify-email/${token}`;

  await transporter.sendMail({
    from: `"AVS Solar Consultancy" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Verify Your Email - AVS Solar Consultancy",

    html: `
      <!DOCTYPE html>
      <html>
      <body style="
        font-family: Arial, sans-serif;
        background:#f5f5f5;
        padding:30px;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          background:white;
          padding:30px;
          border-radius:10px;
        ">

          <h2 style="color:#0052cc;">
            AVS Solar Consultancy
          </h2>

          <p>Hello ${user.fullName},</p>

          <p>
            Thank you for creating an account with
            AVS Solar Consultancy.
          </p>

          <p>
            Please verify your email address by clicking
            the button below.
          </p>

          <a
            href="${verifyUrl}"
            style="
              display:inline-block;
              padding:12px 22px;
              background:#0052cc;
              color:white;
              text-decoration:none;
              border-radius:6px;
              font-weight:bold;
            "
          >
            Verify Email
          </a>

          <p style="margin-top:25px;">
            If the button doesn't work, copy and paste
            this link into your browser:
          </p>

          <p>
            ${verifyUrl}
          </p>

          <p>
            This verification link is valid for 24 hours.
          </p>

          <p>
            Regards,<br>
            AVS Solar Consultancy
          </p>

        </div>

      </body>
      </html>
    `,
  });
};


// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;

    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      typeof fullName !== "string" ||
      !fullName.trim()
    ) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const cleanName = fullName.trim();

    const cleanEmail =
      email.trim().toLowerCase();


    // -----------------------------------------------
    // CHECK EXISTING USER
    // -----------------------------------------------

    let user = await User.findOne({
      email: cleanEmail,
    });


    // -----------------------------------------------
    // EXISTING VERIFIED ACCOUNT
    // -----------------------------------------------

    if (user && user.isVerified) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }


    // -----------------------------------------------
    // EXISTING UNVERIFIED ACCOUNT
    // -----------------------------------------------

    if (user && !user.isVerified) {
      const verificationToken =
        crypto.randomBytes(32).toString("hex");

      user.fullName = cleanName;

      user.verificationToken =
        verificationToken;

      await user.save();

      try {
        await sendVerificationEmail(
          user,
          verificationToken
        );

        return res.status(200).json({
          message:
            "Account already exists but is not verified. A new verification email has been sent.",
        });

      } catch (emailError) {
        console.error(
          "Verification email error:",
          emailError
        );

        return res.status(500).json({
          message:
            "Account exists but verification email could not be sent.",
        });
      }
    }


    // -----------------------------------------------
    // CREATE NEW USER
    // -----------------------------------------------

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user = new User({
      fullName: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
      isVerified: false,
      isActive: true,
      verificationToken,
    });

    await user.save();


    // -----------------------------------------------
    // SEND VERIFICATION EMAIL
    // -----------------------------------------------

    try {
      await sendVerificationEmail(
        user,
        verificationToken
      );

    } catch (emailError) {
      console.error(
        "Verification email failed:",
        emailError
      );

      // Remove account if email could not be sent.
      await User.findByIdAndDelete(user._id);

      return res.status(500).json({
        message:
          "Registration failed because the verification email could not be sent.",
      });
    }


    return res.status(201).json({
      message:
        "Registration successful. Please check your email and verify your account.",
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during registration",
    });
  }
};


// =====================================================
// VERIFY EMAIL
// =====================================================

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    console.log(
      "Verification token received:",
      token
    );

    if (!token) {
      return res.redirect(
        `${FRONTEND_URL}/email-verified?status=error&message=Verification%20token%20is%20missing`
      );
    }


    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.redirect(
        `${FRONTEND_URL}/email-verified?status=error&message=Invalid%20or%20expired%20verification%20link`
      );
    }


    // Already verified
    if (user.isVerified) {
      return res.redirect(
        `${FRONTEND_URL}/email-verified?status=already`
      );
    }


    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    console.log(
      "Email verified successfully:",
      user.email
    );

    return res.redirect(
      `${FRONTEND_URL}/email-verified?status=success`
    );

  } catch (error) {
    console.error(
      "Email verification error:",
      error
    );

    return res.redirect(
      `${FRONTEND_URL}/email-verified?status=error&message=Something%20went%20wrong`
    );
  }
};


// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }


    // -----------------------------------------------
    // CLEAN EMAIL
    // -----------------------------------------------

    const cleanEmail =
      email.trim().toLowerCase();


    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    // -----------------------------------------------
    // CHECK EMAIL VERIFICATION
    // -----------------------------------------------

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }


    // -----------------------------------------------
    // CHECK ACTIVE STATUS
    // -----------------------------------------------

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated by the administrator",
      });
    }


    // -----------------------------------------------
    // CHECK PASSWORD
    // -----------------------------------------------

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    // -----------------------------------------------
    // CREATE JWT
    // -----------------------------------------------

    const token =
      jwt.sign(
        {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );


    // -----------------------------------------------
    // LOGIN RESPONSE
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
      },

      message:
        "Login successful",
    });

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error during login",
    });
  }
};


// =====================================================
// LOGOUT
// =====================================================

export const logoutUser = async (
  req,
  res
) => {

  res.clearCookie("token");

  return res.status(200).json({
    message: "Logout successful",
    success: true,
  });
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = async (
  req,
  res
) => {

  try {

    const { email } = req.body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Email is required",
      });
    }


    const cleanEmail =
      email.trim().toLowerCase();


    // -----------------------------------------------
    // FIND USER
    // -----------------------------------------------

    const user =
      await User.findOne({
        email: cleanEmail,
      });


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }


    // -----------------------------------------------
    // CREATE RESET TOKEN
    // -----------------------------------------------

    const resetToken =
      crypto.randomBytes(32).toString("hex");


    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpire =
      new Date(
        Date.now() + 10 * 60 * 1000
      );


    await user.save();


    // -----------------------------------------------
    // FRONTEND RESET URL
    // -----------------------------------------------

    const resetUrl =
      `${FRONTEND_URL}/reset-password/${resetToken}`;


    // -----------------------------------------------
    // SEND RESET EMAIL
    // -----------------------------------------------

    try {

      await transporter.sendMail({

        from:
          `"AVS Solar Consultancy" <${process.env.EMAIL_USER}>`,

        to: user.email,

        subject:
          "Password Reset - AVS Solar Consultancy",

        html: `
          <!DOCTYPE html>
          <html>
          <body style="
            font-family: Arial, sans-serif;
            background:#f5f5f5;
            padding:30px;
          ">

            <div style="
              max-width:600px;
              margin:auto;
              background:white;
              padding:30px;
              border-radius:10px;
            ">

              <h2 style="color:#0052cc;">
                AVS Solar Consultancy
              </h2>

              <p>
                You requested a password reset.
              </p>

              <p>
                Click below to reset your password:
              </p>

              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:12px 20px;
                  background:#0052cc;
                  color:white;
                  text-decoration:none;
                  border-radius:6px;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>

              <p style="margin-top:25px;">
                This link expires in 10 minutes.
              </p>

              <p>
                If you did not request this password reset,
                you can safely ignore this email.
              </p>

            </div>

          </body>
          </html>
        `,
      });


      return res.status(200).json({
        message:
          "Password reset link sent to your email",
      });

    } catch (emailError) {

      console.error(
        "Reset email error:",
        emailError
      );

      return res.status(500).json({
        message:
          "Failed to send password reset email",
      });
    }

  } catch (error) {

    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during password reset process",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = async (
  req,
  res
) => {

  try {

    const {
      token,
    } = req.params;

    const {
      password,
    } = req.body;


    // -----------------------------------------------
    // VALIDATION
    // -----------------------------------------------

    if (
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }


    // -----------------------------------------------
    // FIND USER WITH VALID TOKEN
    // -----------------------------------------------

    const user =
      await User.findOne({

        resetPasswordToken: token,

        resetPasswordExpire: {
          $gt: new Date(),
        },

      });


    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired token",
      });
    }


    // -----------------------------------------------
    // UPDATE PASSWORD
    // -----------------------------------------------

    user.password =
      await bcrypt.hash(
        password,
        10
      );


    // -----------------------------------------------
    // CLEAR RESET TOKEN
    // -----------------------------------------------

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;


    await user.save();


    return res.status(200).json({
      message:
        "Password updated successfully",
    });

  } catch (error) {

    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during password reset",
    });
  }
};