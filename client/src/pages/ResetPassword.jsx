import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImageFile from '../assets/ig.jpg';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

   try {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/user/reset-password/${token}`,
    { password }
  );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImageFile})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#0a192f',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "#f5f5f5",
          padding: "50px",
          borderRadius: "20px",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#0b57d0" }}>
          AVS SOLAR
        </h1>

        <h2
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "10px",
              border: "none",
              background: "#3d3d3d",
              color: "#fff",
              fontSize: "18px",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "#0b57d0",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "20px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;