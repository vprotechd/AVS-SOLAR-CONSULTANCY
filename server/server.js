import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

import teamRoutes from "./routes/teamRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

/*
====================================================
APP CONFIGURATION
====================================================
*/

const app = express();

const PORT = process.env.PORT || 5000;

const MONGO_URI = process.env.MONGO_URI;

const JWT_SECRET = process.env.JWT_SECRET;

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  "kritikabharti577@gmail.com";

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  "Admin#009";

/*
====================================================
ENVIRONMENT VALIDATION
====================================================
*/

if (!MONGO_URI) {
  console.error("=================================");
  console.error("ERROR: MONGO_URI is missing");
  console.error("Add MONGO_URI to your .env file");
  console.error("=================================");

  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("=================================");
  console.error("ERROR: JWT_SECRET is missing");
  console.error("Add JWT_SECRET to your .env file");
  console.error("=================================");

  process.exit(1);
}

/*
====================================================
CORS
====================================================
*/

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/*
====================================================
BODY PARSERS
====================================================
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
====================================================
USER MODEL
====================================================
*/

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

/*
====================================================
ORDER MODEL
====================================================
*/

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Completed",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Order =
  mongoose.models.Order ||
  mongoose.model("Order", orderSchema);

/*
====================================================
MONGODB CONNECTION
====================================================
*/

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("=================================");
    console.log("MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("MongoDB Connection Failed");
    console.error(error.message);
    console.error("=================================");

    process.exit(1);
  }
};

/*
====================================================
CREATE / UPDATE ADMIN
====================================================
*/

const createAdmin = async () => {
  try {
    const normalizedEmail = ADMIN_EMAIL
      .trim()
      .toLowerCase();

    let admin = await User.findOne({
      email: normalizedEmail,
    });

    if (admin) {
      admin.name = "AVS Solar Admin";
      admin.email = normalizedEmail;
      admin.role = "admin";
      admin.isActive = true;

      /*
      Only change the password if the configured
      admin password is different.
      */

      const passwordMatches =
        await bcrypt.compare(
          ADMIN_PASSWORD,
          admin.password
        );

      if (!passwordMatches) {
        admin.password =
          await bcrypt.hash(
            ADMIN_PASSWORD,
            10
          );
      }

      await admin.save();

      console.log("=================================");
      console.log("ADMIN ACCOUNT VERIFIED");
      console.log("Email:", normalizedEmail);
      console.log("=================================");

      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        ADMIN_PASSWORD,
        10
      );

    admin = await User.create({
      name: "AVS Solar Admin",
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("=================================");
    console.log("ADMIN ACCOUNT CREATED");
    console.log("Email:", normalizedEmail);
    console.log("=================================");
  } catch (error) {
    console.error(
      "Admin creation/update error:",
      error.message
    );
  }
};

/*
====================================================
AUTHENTICATION MIDDLEWARE
====================================================
*/

const authenticateToken = async (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authorization token is required",
      });
    }

    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.substring(7).trim()
        : authHeader.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    /*
    IMPORTANT:
    Login and authentication MUST use
    the exact same JWT_SECRET.
    */

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user =
      await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/*
====================================================
ADMIN MIDDLEWARE
====================================================
*/

const adminOnly = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Admin access required",
    });
  }

  next();
};

/*
====================================================
TEAM ROUTES
====================================================
*/

app.use(
  "/api/team",
  teamRoutes
);

app.use("/api/products", productRoutes);

app.use("/api/contact", contactRoutes);

/*
====================================================
HEALTH CHECK
====================================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "AVS Solar Backend is running",

    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/*
====================================================
REGISTER
POST /api/register
====================================================
*/

app.post(
  "/api/register",
  async (req, res) => {
    try {
      const rawName =
        req.body.fullName ||
        req.body.name ||
        "";

      const email =
        req.body.email;

      const password =
        req.body.password;

      if (
        !rawName ||
        !rawName.trim() ||
        !email ||
        !String(email).trim() ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required",
        });
      }

      const cleanName =
        rawName.trim();

      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();

      if (
        String(password).length < 6
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Password must be at least 6 characters",
        });
      }

      const existingUser =
        await User.findOne({
          email: cleanEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "User already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          String(password),
          10
        );

      /*
      IMPORTANT:
      Public registration can NEVER
      create an admin.
      */

      const user =
        await User.create({
          name: cleanName,
          email: cleanEmail,
          password: hashedPassword,
          role: "user",
          isActive: true,
        });

      return res.status(201).json({
        success: true,
        message:
          "Registration successful!",

        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "Email already registered",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
====================================================
LOGIN
POST /api/login
====================================================
*/

app.post(
  "/api/login",
  async (req, res) => {
    try {
      const email =
        req.body.email;

      const password =
        req.body.password;

      console.log(
        "Login request:",
        email
      );

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();

      const user =
        await User.findOne({
          email: cleanEmail,
        });

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message:
            "Your account has been deactivated by the administrator",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          String(password),
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      /*
      JWT contains ID, email and role.
      */

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

      return res.status(200).json({
        success: true,
        message:
          "Login successful!",

        token,

        role: user.role,

        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

/*
====================================================
GET CURRENT USER
GET /api/me
====================================================
*/

app.get(
  "/api/me",
  authenticateToken,
  async (req, res) => {
    return res.status(200).json({
      success: true,

      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive:
          req.user.isActive,
      },
    });
  }
);

/*
====================================================
ADMIN - CURRENT ADMIN
GET /api/admin/me
====================================================
*/

app.get(
  "/api/admin/me",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    return res.status(200).json({
      success: true,

      admin: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        isActive:
          req.user.isActive,
      },
    });
  }
);

/*
====================================================
ADMIN - GET ALL USERS
GET /api/admin/users
====================================================
*/

app.get(
  "/api/admin/users",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const users =
        await User.find({})
          .select("-password")
          .sort({
            createdAt: -1,
          })
          .lean();

      const safeUsers =
        users.map((user) => ({
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive:
            user.isActive,
          createdAt:
            user.createdAt,
          updatedAt:
            user.updatedAt,
        }));

      return res.status(200).json({
        success: true,
        count: safeUsers.length,
        users: safeUsers,
      });
    } catch (error) {
      console.error(
        "Get users error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch users",
      });
    }
  }
);

/*
====================================================
ADMIN - ACTIVATE USER
PUT /api/admin/users/:id/activate
====================================================
*/

app.put(
  "/api/admin/users/:id/activate",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      user.isActive = true;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "User activated successfully",

        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive:
            user.isActive,
        },
      });
    } catch (error) {
      console.error(
        "Activate user error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to activate user",
      });
    }
  }
);

/*
====================================================
ADMIN - DEACTIVATE USER
PUT /api/admin/users/:id/deactivate
====================================================
*/

app.put(
  "/api/admin/users/:id/deactivate",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      /*
      Admin cannot deactivate himself.
      */

      if (
        user._id.toString() ===
        req.user._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot deactivate your own admin account",
        });
      }

      user.isActive = false;

      await user.save();

      return res.status(200).json({
        success: true,
        message:
          "User deactivated successfully",

        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive:
            user.isActive,
        },
      });
    } catch (error) {
      console.error(
        "Deactivate user error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to deactivate user",
      });
    }
  }
);

/*
====================================================
ADMIN - DELETE USER
DELETE /api/admin/users/:id
====================================================
*/

app.delete(
  "/api/admin/users/:id",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found",
        });
      }

      /*
      Admin cannot delete himself.
      */

      if (
        user._id.toString() ===
        req.user._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot delete your own admin account",
        });
      }

      /*
      Prevent deleting another admin.
      */

      if (user.role === "admin") {
        return res.status(400).json({
          success: false,
          message:
            "Admin accounts cannot be deleted from this page",
        });
      }

      await User.findByIdAndDelete(
        req.params.id
      );

      return res.status(200).json({
        success: true,
        message:
          "User deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete user",
      });
    }
  }
);

/*
====================================================
ADMIN DASHBOARD
GET /api/admin/dashboard
====================================================
*/

app.get(
  "/api/admin/dashboard",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      /*
      ----------------------------------------------
      USER COUNTS
      ----------------------------------------------
      */

      const totalUsers =
        await User.countDocuments();

      const activeUsers =
        await User.countDocuments({
          isActive: true,
        });

      /*
      ----------------------------------------------
      ORDER COUNTS
      ----------------------------------------------
      */

      const totalOrders =
        await Order.countDocuments();

      const pendingOrders =
        await Order.countDocuments({
          status: "Pending",
        });

      const completedOrders =
        await Order.countDocuments({
          status: {
            $in: [
              "Completed",
              "Delivered",
            ],
          },
        });

      /*
      ----------------------------------------------
      REVENUE
      ----------------------------------------------
      */

      const revenueResult =
        await Order.aggregate([
          {
            $match: {
              status: {
                $ne: "Cancelled",
              },
            },
          },

          {
            $group: {
              _id: null,
              total: {
                $sum: "$price",
              },
            },
          },
        ]);

      const totalRevenue =
        revenueResult.length > 0
          ? Number(
              revenueResult[0].total
            ) || 0
          : 0;

      /*
      ----------------------------------------------
      RECENT ORDERS
      ----------------------------------------------
      */

      const recentOrders =
        await Order.find({})
          .sort({
            orderDate: -1,
          })
          .limit(5)
          .lean();

      const formattedOrders =
        recentOrders.map(
          (order) => ({
            ...order,

            id: order._id,

            _id: order._id,

            orderNumber:
              `ORD-${String(
                order._id
              ).slice(-8)}`,

            customerName:
              order.name,

            total:
              Number(
                order.price
              ) || 0,

            createdAt:
              order.orderDate,
          })
        );

      /*
      ----------------------------------------------
      RECENT USERS
      ----------------------------------------------
      */

      const recentUsers =
        await User.find({})
          .select("-password")
          .sort({
            createdAt: -1,
          })
          .limit(5)
          .lean();

      const formattedUsers =
        recentUsers.map(
          (user) => ({
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive:
              user.isActive,
            createdAt:
              user.createdAt,
          })
        );

      /*
      ----------------------------------------------
      SALES - LAST 7 DAYS
      ----------------------------------------------
      */

      const sevenDaysAgo =
        new Date();

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 6
      );

      sevenDaysAgo.setHours(
        0,
        0,
        0,
        0
      );

      const salesResult =
        await Order.aggregate([
          {
            $match: {
              orderDate: {
                $gte: sevenDaysAgo,
              },

              status: {
                $ne: "Cancelled",
              },
            },
          },

          {
            $group: {
              _id: {
                $dateToString: {
                  format:
                    "%Y-%m-%d",

                  date:
                    "$orderDate",
                },
              },

              amount: {
                $sum: "$price",
              },
            },
          },

          {
            $sort: {
              _id: 1,
            },
          },
        ]);

      const sales =
        salesResult.map(
          (item) => ({
            date: item._id,

            amount:
              Number(
                item.amount
              ) || 0,

            revenue:
              Number(
                item.amount
              ) || 0,
          })
        );

      /*
      ----------------------------------------------
      PRODUCT / TEAM COUNTS
      ----------------------------------------------

      Team count is loaded dynamically if the
      TeamMember model is available.
      */

      let totalTeamMembers = 0;

      try {
        const TeamMember =
          mongoose.models.TeamMember;

        if (TeamMember) {
          totalTeamMembers =
            await TeamMember.countDocuments();
        }
      } catch (error) {
        console.error(
          "Team count error:",
          error.message
        );
      }

      /*
      Product model will be added when the
      Product system is implemented.
      */

      const totalProducts = 0;

      /*
      ----------------------------------------------
      RESPONSE
      ----------------------------------------------
      */

      return res.status(200).json({
        success: true,

        users: totalUsers,
        totalUsers,

        activeUsers,
        activeUserCount:
          activeUsers,

        orders: totalOrders,
        totalOrders,

        pendingOrders,
        pending:
          pendingOrders,

        completedOrders,
        completed:
          completedOrders,

        revenue:
          totalRevenue,

        totalRevenue:
          totalRevenue,

        products:
          totalProducts,

        totalProducts:
          totalProducts,

        teamMembers:
          totalTeamMembers,

        totalTeamMembers:
          totalTeamMembers,

        recentOrders:
          formattedOrders,

        recentUsers:
          formattedUsers,

        sales,
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load admin dashboard",
      });
    }
  }
);

/*
====================================================
PLACE ORDER
POST /api/orders/place-order
====================================================
*/

app.post(
  "/api/orders/place-order",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        productName,
        price,
      } = req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !productName ||
        price === undefined ||
        price === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All order fields are required",
        });
      }

      const numericPrice =
        Number(price);

      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order price",
        });
      }

      const newOrder =
        await Order.create({
          name:
            String(name).trim(),

          email:
            String(email)
              .trim()
              .toLowerCase(),

          phone:
            String(phone).trim(),

          address:
            String(address).trim(),

          productName:
            String(
              productName
            ).trim(),

          price:
            numericPrice,

          orderDate:
            new Date(),

          status:
            "Pending",
        });

      return res.status(201).json({
        success: true,

        message:
          "Order placed successfully",

        order: {
          ...newOrder.toObject(),

          id: newOrder._id,

          _id: newOrder._id,

          orderNumber:
            `ORD-${String(
              newOrder._id
            ).slice(-8)}`,
        },
      });
    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  }
);

/*
====================================================
GET ALL ORDERS
GET /api/orders
====================================================
*/

app.get(
  "/api/orders",
  authenticateToken,
  adminOnly,
  async (req, res) => {
    try {
      const orders =
        await Order.find({})
          .sort({
            orderDate: -1,
          })
          .lean();

      const formattedOrders =
        orders.map(
          (order) => ({
            ...order,

            id: order._id,

            _id: order._id,

            orderNumber:
              `ORD-${String(
                order._id
              ).slice(-8)}`,

            customerName:
              order.name,

            total:
              Number(
                order.price
              ) || 0,

            createdAt:
              order.orderDate,
          })
        );

      return res.status(200).json({
        success: true,

        count:
          formattedOrders.length,

        orders:
          formattedOrders,
      });
    } catch (error) {
      console.error(
        "Get orders error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
      });
    }
  }
);

/*
====================================================
404 HANDLER
====================================================
*/

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,

      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

/*
====================================================
GLOBAL ERROR HANDLER
====================================================
*/

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Global server error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

/*
====================================================
START SERVER
====================================================
*/

const startServer = async () => {
  try {
    await connectDB();

    await createAdmin();

    app.listen(
      PORT,
      () => {
        console.log(
          "================================="
        );

        console.log(
          `AVS Solar Backend running on port ${PORT}`
        );

         console.log(
      `Server running on port ${PORT}`
    );

        console.log(
          "Login: POST /api/login"
        );

        console.log(
          "Register: POST /api/register"
        );

        console.log(
          "Current User: GET /api/me"
        );

        console.log(
          "Admin Users: GET /api/admin/users"
        );

        console.log(
          "Admin Dashboard: GET /api/admin/dashboard"
        );

        console.log(
          "Team: /api/team"
        );

        console.log(
          "Orders: /api/orders"
        );

        console.log(
          "================================="
        );
      }
    );
  } catch (error) {
    console.error(
      "Server startup error:",
      error
    );

    process.exit(1);
  }
};

startServer();