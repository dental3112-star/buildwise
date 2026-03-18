import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to get user from access token
async function getUserFromToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  
  const accessToken = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Health check endpoint
app.get("/make-server-663c61b0/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTHENTICATION ==========

// Sign up endpoint
app.post("/make-server-663c61b0/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Create user with admin privileges
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log("User created:", data.user.id);
    return c.json({ user: data.user });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Failed to create user", details: String(error) }, 500);
  }
});

// Login endpoint
app.post("/make-server-663c61b0/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log("User logged in:", data.user.id);
    return c.json({ user: data.user, session: data.session });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Failed to log in user", details: String(error) }, 500);
  }
});

// Logout endpoint
app.post("/make-server-663c61b0/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Sign out user
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log("User logged out:", user.id);
    return c.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({ error: "Failed to log out user", details: String(error) }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-663c61b0/user", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    console.log("User profile fetched:", user.id);
    return c.json({ user });
  } catch (error) {
    console.error("Get user profile error:", error);
    return c.json({ error: "Failed to get user profile", details: String(error) }, 500);
  }
});

// ========== CONTRACTS ==========

// Get all contracts
app.get("/make-server-663c61b0/contracts", async (c) => {
  try {
    const contracts = await kv.getByPrefix("contract:");
    console.log("Fetched contracts:", contracts);
    return c.json({ contracts: contracts || [] });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return c.json({ error: "Failed to fetch contracts", details: String(error) }, 500);
  }
});

// Create a new contract
app.post("/make-server-663c61b0/contracts", async (c) => {
  try {
    const contract = await c.req.json();
    const id = contract.id || `contract_${Date.now()}`;
    const contractData = { ...contract, id };
    
    await kv.set(`contract:${id}`, contractData);
    console.log("Created contract:", contractData);
    return c.json({ contract: contractData });
  } catch (error) {
    console.error("Error creating contract:", error);
    return c.json({ error: "Failed to create contract", details: String(error) }, 500);
  }
});

// Update a contract
app.put("/make-server-663c61b0/contracts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(`contract:${id}`);
    if (!existing) {
      return c.json({ error: "Contract not found" }, 404);
    }
    
    const updated = { ...existing, ...updates, id };
    await kv.set(`contract:${id}`, updated);
    console.log("Updated contract:", updated);
    return c.json({ contract: updated });
  } catch (error) {
    console.error("Error updating contract:", error);
    return c.json({ error: "Failed to update contract", details: String(error) }, 500);
  }
});

// Delete a contract
app.delete("/make-server-663c61b0/contracts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`contract:${id}`);
    console.log("Deleted contract:", id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting contract:", error);
    return c.json({ error: "Failed to delete contract", details: String(error) }, 500);
  }
});

// ========== PAYMENTS ==========

// Get all payments
app.get("/make-server-663c61b0/payments", async (c) => {
  try {
    const payments = await kv.getByPrefix("payment:");
    console.log("Fetched payments:", payments);
    return c.json({ payments: payments || [] });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return c.json({ error: "Failed to fetch payments", details: String(error) }, 500);
  }
});

// Create a new payment
app.post("/make-server-663c61b0/payments", async (c) => {
  try {
    const payment = await c.req.json();
    const id = payment.id || `payment_${Date.now()}`;
    const paymentData = { ...payment, id };
    
    await kv.set(`payment:${id}`, paymentData);
    console.log("Created payment:", paymentData);
    return c.json({ payment: paymentData });
  } catch (error) {
    console.error("Error creating payment:", error);
    return c.json({ error: "Failed to create payment", details: String(error) }, 500);
  }
});

// Update a payment
app.put("/make-server-663c61b0/payments/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(`payment:${id}`);
    if (!existing) {
      return c.json({ error: "Payment not found" }, 404);
    }
    
    const updated = { ...existing, ...updates, id };
    await kv.set(`payment:${id}`, updated);
    console.log("Updated payment:", updated);
    return c.json({ payment: updated });
  } catch (error) {
    console.error("Error updating payment:", error);
    return c.json({ error: "Failed to update payment", details: String(error) }, 500);
  }
});

// ========== INCOME ==========

// Get all income records
app.get("/make-server-663c61b0/income", async (c) => {
  try {
    const income = await kv.getByPrefix("income:");
    console.log("Fetched income:", income);
    return c.json({ income: income || [] });
  } catch (error) {
    console.error("Error fetching income:", error);
    return c.json({ error: "Failed to fetch income", details: String(error) }, 500);
  }
});

// Create a new income record
app.post("/make-server-663c61b0/income", async (c) => {
  try {
    const income = await c.req.json();
    const id = income.id || `income_${Date.now()}`;
    const incomeData = { ...income, id };
    
    await kv.set(`income:${id}`, incomeData);
    console.log("Created income:", incomeData);
    return c.json({ income: incomeData });
  } catch (error) {
    console.error("Error creating income:", error);
    return c.json({ error: "Failed to create income", details: String(error) }, 500);
  }
});

// Delete an income record
app.delete("/make-server-663c61b0/income/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`income:${id}`);
    console.log("Deleted income:", id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting income:", error);
    return c.json({ error: "Failed to delete income", details: String(error) }, 500);
  }
});

// ========== EXPENSES ==========

// Get all expense records
app.get("/make-server-663c61b0/expenses", async (c) => {
  try {
    const expenses = await kv.getByPrefix("expense:");
    console.log("Fetched expenses:", expenses);
    return c.json({ expenses: expenses || [] });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return c.json({ error: "Failed to fetch expenses", details: String(error) }, 500);
  }
});

// Create a new expense record
app.post("/make-server-663c61b0/expenses", async (c) => {
  try {
    const expense = await c.req.json();
    const id = expense.id || `expense_${Date.now()}`;
    const expenseData = { ...expense, id };
    
    await kv.set(`expense:${id}`, expenseData);
    console.log("Created expense:", expenseData);
    return c.json({ expense: expenseData });
  } catch (error) {
    console.error("Error creating expense:", error);
    return c.json({ error: "Failed to create expense", details: String(error) }, 500);
  }
});

// Delete an expense record
app.delete("/make-server-663c61b0/expenses/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`expense:${id}`);
    console.log("Deleted expense:", id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return c.json({ error: "Failed to delete expense", details: String(error) }, 500);
  }
});

// ========== NOTIFICATIONS ==========

// Get all notifications
app.get("/make-server-663c61b0/notifications", async (c) => {
  try {
    const notifications = await kv.getByPrefix("notification:");
    console.log("Fetched notifications:", notifications);
    return c.json({ notifications: notifications || [] });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ error: "Failed to fetch notifications", details: String(error) }, 500);
  }
});

// Mark notification as read
app.put("/make-server-663c61b0/notifications/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();
    
    const existing = await kv.get(`notification:${id}`);
    if (!existing) {
      return c.json({ error: "Notification not found" }, 404);
    }
    
    const updated = { ...existing, ...updates, id };
    await kv.set(`notification:${id}`, updated);
    console.log("Updated notification:", updated);
    return c.json({ notification: updated });
  } catch (error) {
    console.error("Error updating notification:", error);
    return c.json({ error: "Failed to update notification", details: String(error) }, 500);
  }
});

// Initialize sample data (for first-time setup)
app.post("/make-server-663c61b0/init-data", async (c) => {
  try {
    // Check if data already exists
    const existingContracts = await kv.getByPrefix("contract:");
    if (existingContracts && existingContracts.length > 0) {
      return c.json({ message: "Data already initialized" });
    }

    // Sample contracts
    const sampleContracts = [
      {
        id: "contract_1",
        roomNumber: "201",
        tenant: "김철수",
        contact: "010-1234-5678",
        deposit: 10000000,
        monthlyRent: 500000,
        maintenanceFee: 50000,
        startDate: "2025-01-01",
        endDate: "2027-01-01",
        status: "active",
        createdAt: new Date().toISOString(),
      },
      {
        id: "contract_2",
        roomNumber: "301",
        tenant: "이영희",
        contact: "010-2345-6789",
        deposit: 15000000,
        monthlyRent: 650000,
        maintenanceFee: 60000,
        startDate: "2024-06-01",
        endDate: "2026-06-01",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample payments
    const samplePayments = [
      {
        id: "payment_1",
        contractId: "contract_1",
        roomNumber: "201",
        tenant: "김철수",
        amount: 500000,
        type: "월세",
        dueDate: "2026-03-01",
        paidDate: "2026-03-01",
        status: "paid",
        createdAt: new Date().toISOString(),
      },
      {
        id: "payment_2",
        contractId: "contract_2",
        roomNumber: "301",
        tenant: "이영희",
        amount: 650000,
        type: "월세",
        dueDate: "2026-03-01",
        paidDate: null,
        status: "overdue",
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample income
    const sampleIncome = [
      {
        id: "income_1",
        amount: 500000,
        category: "월세",
        date: "2026-03-01",
        description: "201호 3월 월세",
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample expenses
    const sampleExpenses = [
      {
        id: "expense_1",
        amount: 120000,
        category: "수리비",
        date: "2026-03-15",
        description: "301호 에어컨 수리",
        createdAt: new Date().toISOString(),
      },
    ];

    // Sample notifications
    const sampleNotifications = [
      {
        id: "notification_1",
        type: "미납",
        title: "3층 301호 월세 미납",
        description: "이영희 3일차 미납",
        date: "2026-03-17",
        priority: "high",
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];

    // Save all sample data
    for (const contract of sampleContracts) {
      await kv.set(`contract:${contract.id}`, contract);
    }
    for (const payment of samplePayments) {
      await kv.set(`payment:${payment.id}`, payment);
    }
    for (const income of sampleIncome) {
      await kv.set(`income:${income.id}`, income);
    }
    for (const expense of sampleExpenses) {
      await kv.set(`expense:${expense.id}`, expense);
    }
    for (const notification of sampleNotifications) {
      await kv.set(`notification:${notification.id}`, notification);
    }

    console.log("Sample data initialized");
    return c.json({ 
      message: "Sample data initialized successfully",
      counts: {
        contracts: sampleContracts.length,
        payments: samplePayments.length,
        income: sampleIncome.length,
        expenses: sampleExpenses.length,
        notifications: sampleNotifications.length,
      }
    });
  } catch (error) {
    console.error("Error initializing data:", error);
    return c.json({ error: "Failed to initialize data", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);