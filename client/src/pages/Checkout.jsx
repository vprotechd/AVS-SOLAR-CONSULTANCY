import React, { useState } from "react";

function Checkout() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(
        `${API_URL}/orders/place-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            productName: "550W Solar Panel",
            price: 18999,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Order Submitted Successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
        });
      } else {
        alert(data.message || "Unable to place order.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Checkout</h1>

        <p style={styles.subtitle}>
          Enter your details to place your order
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
          style={{
            ...styles.input,
            height: "110px",
            resize: "none",
          }}
        />

        <div style={styles.orderSummary}>
          <div>
            <span>Product</span>
            <strong>550W Solar Panel</strong>
          </div>

          <div>
            <span>Price</span>
            <strong>₹18,999</strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#eef3f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px 15px",
    boxSizing: "border-box",
  },

  form: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "18px",
    boxShadow: "0 15px 45px rgba(7, 35, 60, 0.12)",
    boxSizing: "border-box",
  },

  title: {
    margin: "0",
    color: "#09233a",
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
  },

  subtitle: {
    margin: "10px 0 30px",
    color: "#68737d",
    textAlign: "center",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    backgroundColor: "#f8fafc",
    color: "#172b3a",
    border: "1px solid #d9e1e7",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },

  orderSummary: {
    margin: "10px 0 20px",
    padding: "16px",
    background: "#f5f7f9",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    color: "#09233a",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "#09233a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default Checkout;