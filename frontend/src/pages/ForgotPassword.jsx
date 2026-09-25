// src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldCheck } from "lucide-react";

import "./forgotPassword.css";
import { API_URL } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      console.log(
        "📧 Sending request to:",
        `${API_URL}/auth/forgot-password`
      );
      console.log("📧 Email:", trimmedEmail);

      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        }
      );

      console.log("📧 Response status:", response.status);

      const data = await response.json();

      console.log("📧 Response data:", data);

      if (response.ok && data.success) {
        setEmail(trimmedEmail);
        setSent(true);

        toast.success("Password reset link sent to your email!");
      } else {
        toast.error(
          data.message || "Failed to send reset link"
        );
      }
    } catch (error) {
      console.error("❌ Network error:", error);

      toast.error(
        "Network error. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Subtle background decoration */}
      <div className="auth-background">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <motion.div
        className="auth-card forgot-password-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        {!sent ? (
          <>
            {/* Header */}
            <div className="auth-header">
              <div className="auth-icon-box">
                <ShieldCheck size={26} />
              </div>

              <div className="auth-badge">
                Account Security
              </div>

              <h2 className="auth-title">
                Forgot <span>Password?</span>
              </h2>

              <p className="auth-subtitle">
                No worries. Enter your registered email address
                and we'll send you a secure link to reset your
                password.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="auth-form"
            >
              <div className="form-group">
                <label htmlFor="forgot-email">
                  Email Address
                </label>

                <div className="auth-input-wrapper">
                  <Mail
                    className="auth-input-icon"
                    size={19}
                  />

                  <input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="auth-input"
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Reset Link
                  </>
                )}
              </button>

              <div className="auth-switch">
                Remember your password?{" "}
                <Link to="/login">
                  Login
                </Link>
              </div>
            </form>
          </>
        ) : (
          /* Success State */
          <motion.div
            className="reset-success"
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="success-icon">
              <CheckCircle2 size={38} />
            </div>

            <div className="auth-badge success-badge">
              Email Sent
            </div>

            <h2 className="auth-title">
              Check Your <span>Email</span>
            </h2>

            <p className="auth-subtitle">
              We've sent a password reset link to the
              following email address.
            </p>

            <div className="email-box">
              <Mail size={18} />

              <span>{email}</span>
            </div>

            <p className="small-text">
              Please check your inbox and spam folder. The
              reset link will allow you to securely create a
              new password.
            </p>

            <Link
              to="/login"
              className="back-to-login"
            >
              <ArrowLeft size={17} />
              Back to Login
            </Link>

            <button
              type="button"
              className="try-again-btn"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Use a different email
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}