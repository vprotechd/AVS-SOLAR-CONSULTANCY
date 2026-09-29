// server/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import userRouter from "./routes/user.js";
import adminRoutes from "./routes/adminRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AVS Solar Backend is running",
  });
});

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing in .env");
  process.exit(1);
}

const seedAdmin = async () => {
  const email = "kritikabharti577@gmail.com".toLowerCase();
  const password = "Admin#009";

  let admin = await User.findOne({ email });

  if (admin) {
    admin.fullName = "AVS Solar Admin";
    admin.role = "admin";
    admin.isVerified = true;
    admin.isActive = true;
    admin.password = await bcrypt.hash(password, 10);
    admin.verificationToken = null;
    await admin.save();
    console.log("Admin account refreshed in MongoDB");
    return;
  }

  admin = new User({
    fullName: "AVS Solar Admin",
    email,
    password: await bcrypt.hash(password, 10),
    role: "admin",
    isVerified: true,
    isActive: true,
    verificationToken: null,
  });

  await admin.save();
  console.log("Admin account created in MongoDB");
};

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB successfully!");
    await seedAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
