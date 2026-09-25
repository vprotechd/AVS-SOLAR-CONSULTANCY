import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImageFile from "../assets/ig.jpg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

   try {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/user/forgot-password`,
    {
      email: email.trim().toLowerCase(),
    }
  );

      setMessage(
        res.data?.message ||
          "If an account exists with this email, a reset link has been sent."
      );

      setEmail("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-page"
      style={{
        backgroundImage: `url(${backgroundImageFile})`,
      }}
    >
      <div className="forgot-overlay"></div>

      <div className="forgot-wrapper">

        {/* =========================================
            LEFT IMAGE / BRAND SECTION
        ========================================== */}
        <div className="forgot-image-section">

          <div className="forgot-image-content">

            <div className="forgot-brand">
              AVS SOLAR
            </div>

            <div className="forgot-brand-line"></div>

            <h1>
              Secure access to
              <span> your solar account.</span>
            </h1>

            <p>
              Reset your password and continue managing
              your AVS Solar account with ease.
            </p>

            <div className="forgot-image-bottom">
              <span className="status-dot"></span>
              Secure account recovery
            </div>

          </div>

        </div>


        {/* =========================================
            FORM SECTION
        ========================================== */}
        <div className="forgot-form-section">

          <div className="forgot-form-container">

            {/* Top navigation */}
            <div className="forgot-top">

              <Link
                to="/login"
                className="back-login"
              >
                <span>←</span>
                Back to Login
              </Link>

            </div>


            {/* Icon */}
            <div className="forgot-icon">
              <span>↻</span>
            </div>


            {/* Heading */}
            <div className="forgot-heading">

              <div className="forgot-kicker">
                ACCOUNT RECOVERY
              </div>

              <h2>
                Forgot your password?
              </h2>

              <p>
                Enter the email address associated with
                your AVS Solar account. We will send you
                instructions to reset your password.
              </p>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="forgot-form"
            >

              <div className="forgot-field">

                <label htmlFor="forgot-email">
                  Email Address
                </label>

                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage("");
                    setError("");
                  }}
                  autoComplete="email"
                  required
                />

              </div>


              {/* Error */}
              {error && (
                <div className="forgot-message error">
                  <span>!</span>
                  {error}
                </div>
              )}


              {/* Success */}
              {message && (
                <div className="forgot-message success">
                  <span>✓</span>
                  {message}
                </div>
              )}


              <button
                type="submit"
                className="forgot-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <span>→</span>
                  </>
                )}
              </button>

            </form>


            {/* Bottom */}
            <div className="forgot-bottom">

              <p>
                Remember your password?
              </p>

              <Link to="/login">
                Sign In
              </Link>

            </div>

          </div>

        </div>

      </div>


      <style>{`

        * {
          box-sizing: border-box;
        }

        .forgot-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 35px;
          font-family: inherit;
        }


        /* =========================================
           BACKGROUND
        ========================================== */

        .forgot-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(25, 45, 31, 0.72),
              rgba(25, 45, 31, 0.28)
            );
        }


        /* =========================================
           MAIN WRAPPER
        ========================================== */

        .forgot-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1050px;
          min-height: 610px;
          display: grid;
          grid-template-columns: 46% 54%;
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 25px 70px rgba(0, 0, 0, 0.28);
        }


        /* =========================================
           LEFT SECTION
        ========================================== */

        .forgot-image-section {
          min-height: 610px;
          position: relative;
          background:
            linear-gradient(
              rgba(24, 50, 32, 0.20),
              rgba(19, 37, 25, 0.78)
            ),
            url(${backgroundImageFile});

          background-size: cover;
          background-position: center;

          display: flex;
          align-items: flex-end;
        }


        .forgot-image-content {
          width: 100%;
          padding: 55px;
          color: #ffffff;
        }


        .forgot-brand {
          font-size: 13px;
          letter-spacing: 3px;
          font-weight: 700;
          margin-bottom: 13px;
        }


        .forgot-brand-line {
          width: 45px;
          height: 2px;
          background: #a6bd9b;
          margin-bottom: 25px;
        }


        .forgot-image-content h1 {
          margin: 0;
          max-width: 400px;
          font-size: clamp(36px, 4vw, 53px);
          line-height: 1.08;
          letter-spacing: -1.7px;
          font-weight: 600;
        }


        .forgot-image-content h1 span {
          display: block;
          color: #bfd0b7;
        }


        .forgot-image-content > p {
          max-width: 410px;
          margin: 23px 0 0;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.82);
        }


        .forgot-image-bottom {
          margin-top: 45px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,0.28);
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
          color: rgba(255,255,255,0.78);
        }


        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #9bb68e;
        }


        /* =========================================
           FORM SECTION
        ========================================== */

        .forgot-form-section {
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 65px;
        }


        .forgot-form-container {
          width: 100%;
          max-width: 470px;
        }


        /* =========================================
           TOP
        ========================================== */

        .forgot-top {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 38px;
        }


        .back-login {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #66765f;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          transition: 0.2s ease;
        }


        .back-login span {
          font-size: 17px;
        }


        .back-login:hover {
          color: #4f6c47;
          transform: translateX(-2px);
        }


        /* =========================================
           ICON
        ========================================== */

        .forgot-icon {
          width: 52px;
          height: 52px;
          border: 1px solid #d1ddcb;
          background: #f3f6f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #65815b;
          font-size: 25px;
          margin-bottom: 25px;
        }


        /* =========================================
           HEADING
        ========================================== */

        .forgot-kicker {
          color: #6c895f;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }


        .forgot-heading h2 {
          color: #293229;
          margin: 0;
          font-size: 35px;
          line-height: 1.15;
          letter-spacing: -1px;
          font-weight: 650;
        }


        .forgot-heading p {
          margin: 17px 0 0;
          color: #777e76;
          font-size: 14px;
          line-height: 1.7;
        }


        /* =========================================
           FORM
        ========================================== */

        .forgot-form {
          margin-top: 30px;
        }


        .forgot-field label {
          display: block;
          margin-bottom: 8px;
          color: #4c554b;
          font-size: 13px;
          font-weight: 600;
        }


        .forgot-field input {
          width: 100%;
          height: 52px;
          padding: 0 15px;
          border: 1px solid #d6ddd4;
          border-radius: 7px;
          outline: none;
          color: #293029;
          background: #ffffff;
          font-size: 14px;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }


        .forgot-field input::placeholder {
          color: #a0a59f;
        }


        .forgot-field input:focus {
          border-color: #78956d;
          box-shadow:
            0 0 0 3px rgba(101, 129, 91, 0.10);
        }


        /* =========================================
           MESSAGES
        ========================================== */

        .forgot-message {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-top: 15px;
          padding: 12px 13px;
          border-radius: 6px;
          font-size: 12px;
          line-height: 1.5;
        }


        .forgot-message span {
          min-width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }


        .forgot-message.error {
          color: #8a4c4c;
          background: #faf1f1;
          border: 1px solid #ead8d8;
        }


        .forgot-message.error span {
          background: #c78383;
          color: #ffffff;
        }


        .forgot-message.success {
          color: #55704d;
          background: #f0f5ed;
          border: 1px solid #d4e0cf;
        }


        .forgot-message.success span {
          background: #75946a;
          color: #ffffff;
        }


        /* =========================================
           BUTTON
        ========================================== */

        .forgot-submit {
          width: 100%;
          height: 52px;
          margin-top: 20px;
          border: none;
          border-radius: 7px;
          background: #607f55;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 22px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }


        .forgot-submit:hover:not(:disabled) {
          background: #4f6d46;
          transform: translateY(-1px);
        }


        .forgot-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }


        .forgot-submit span {
          font-size: 18px;
        }


        /* =========================================
           LOADING
        ========================================== */

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.45);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: forgotSpin 0.7s linear infinite;
        }


        @keyframes forgotSpin {
          to {
            transform: rotate(360deg);
          }
        }


        /* =========================================
           BOTTOM
        ========================================== */

        .forgot-bottom {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          margin-top: 27px;
          padding-top: 22px;
          border-top: 1px solid #e8ebe6;
        }


        .forgot-bottom p {
          margin: 0;
          color: #858b84;
          font-size: 13px;
        }


        .forgot-bottom a {
          color: #607f55;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }


        .forgot-bottom a:hover {
          text-decoration: underline;
        }


        /* =========================================
           TABLET
        ========================================== */

        @media (max-width: 850px) {

          .forgot-page {
            padding: 20px;
          }

          .forgot-wrapper {
            grid-template-columns: 1fr;
            max-width: 570px;
          }

          .forgot-image-section {
            min-height: 280px;
          }

          .forgot-image-content {
            padding: 35px;
          }

          .forgot-image-content h1 {
            font-size: 36px;
          }

          .forgot-image-content > p {
            display: none;
          }

          .forgot-image-bottom {
            margin-top: 25px;
          }

          .forgot-form-section {
            padding: 40px;
          }

        }


        /* =========================================
           MOBILE
        ========================================== */

        @media (max-width: 520px) {

          .forgot-page {
            min-height: 100vh;
            padding: 12px;
          }

          .forgot-wrapper {
            border-radius: 14px;
          }

          .forgot-image-section {
            min-height: 220px;
          }

          .forgot-image-content {
            padding: 28px;
          }

          .forgot-brand {
            font-size: 11px;
            letter-spacing: 2px;
          }

          .forgot-image-content h1 {
            font-size: 29px;
            letter-spacing: -0.8px;
          }

          .forgot-image-bottom {
            margin-top: 18px;
            padding-top: 13px;
            font-size: 11px;
          }

          .forgot-form-section {
            padding: 32px 25px 35px;
          }

          .forgot-top {
            margin-bottom: 28px;
          }

          .forgot-icon {
            width: 46px;
            height: 46px;
            font-size: 22px;
            margin-bottom: 20px;
          }

          .forgot-heading h2 {
            font-size: 29px;
          }

          .forgot-heading p {
            font-size: 13px;
          }

        }


        @media (max-width: 360px) {

          .forgot-form-section {
            padding: 28px 20px;
          }

          .forgot-heading h2 {
            font-size: 26px;
          }

          .forgot-image-section {
            min-height: 200px;
          }

        }

      `}</style>
    </div>
  );
}

export default ForgotPassword;