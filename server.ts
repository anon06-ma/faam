import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "faam-rent-car-secret-key";
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase environment variables are missing. Using mock data fallback.");
}

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Fallback Mock Data (if Supabase is not configured)
let mockVehicles = [
  {
    id: "1",
    name: "Range Rover Vogue",
    category: "Luxury",
    pricePerDay: 2500,
    transmission: "Automatic",
    seats: 5,
    fuelType: "Diesel",
    description: "The ultimate luxury SUV for your comfort.",
    images: ["https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000"],
    specs: { engine: "3.0L V6", ac: true, gps: true }
  },
  {
    id: "2",
    name: "Mercedes G-Class",
    category: "Luxury",
    pricePerDay: 3500,
    transmission: "Automatic",
    seats: 5,
    fuelType: "Essence",
    description: "Iconic design and unmatched performance.",
    images: ["https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000"],
    specs: { engine: "4.0L V8", ac: true, gps: true }
  },
  {
    id: "3",
    name: "Dacia Duster",
    category: "SUV",
    pricePerDay: 450,
    transmission: "Manual",
    seats: 5,
    fuelType: "Diesel",
    description: "Reliable and efficient for all terrains.",
    images: ["https://images.unsplash.com/photo-1619103462214-60144943960c?auto=format&fit=crop&q=80&w=1000"],
    specs: { engine: "1.5L dCi", ac: true, gps: false }
  }
];

let mockBookings = [];
let mockReviews = [
  { id: "1", name: "John Doe", rating: 5, comment: "Excellent service and premium cars!", date: "2024-03-10" },
  { id: "2", name: "Sarah Smith", rating: 4, comment: "Very professional team. Highly recommended.", date: "2024-03-08" }
];

let mockSiteContent = {
  hero: {
    en: { title: "Drive Your Journey in Style", subtitle: "Premium car rental for tourists and business travelers in Morocco." },
    fr: { title: "Conduisez avec Style", subtitle: "Location de voitures premium pour touristes et voyageurs d'affaires au Maroc." }
  },
  about: {
    en: "FAAM Rent Car provides reliable and comfortable vehicles for your stay in Morocco.",
    fr: "FAAM Rent Car propose des véhicules fiables et confortables pour votre séjour au Maroc."
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working" });
  });

  app.get("/api/health/db", async (req, res) => {
    if (!supabase) {
      return res.json({ connected: false, reason: "Supabase credentials missing (check your .env file)" });
    }
    try {
      const { error } = await supabase.from('vehicles').select('id').limit(1);
      if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
        return res.json({ connected: false, reason: error.message });
      }
      return res.json({ connected: true, message: "Successfully connected to Supabase!" });
    } catch (err: any) {
      return res.json({ connected: false, reason: err.message });
    }
  });

  app.post(["/api/auth/login", "/api/auth/login/"], async (req, res) => {
    const { email, password } = req.body;
    
    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!error && user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { email, role: user.role } });
      }
    } else {
      if (email === "admin@faam.com" && password === "Faam2026") {
        const token = jwt.sign({ email, role: "Super Admin" }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ token, user: { email, role: "Super Admin" } });
      }
    }
    
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post(["/api/auth/register", "/api/auth/register/"], async (req, res) => {
    console.log("Registration request received:", req.body);
    const { email, password } = req.body;
    
    if (!supabase) {
      return res.status(503).json({ message: "Database not configured. Please set up Supabase environment variables." });
    }

    try {
      // Check if user already exists
      const { data: existingUsers, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email);

      if (fetchError) {
        console.error("Supabase fetch error:", fetchError.message);
        return res.status(500).json({ message: "Error checking existing users", error: fetchError.message });
      }

      if (existingUsers && existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, role: 'Admin' }])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error.message);
        return res.status(400).json({ message: error.message });
      }

      const token = jwt.sign({ email, role: 'Admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ token, user: { email, role: 'Admin' } });
    } catch (err: any) {
      console.error("Registration error:", err.message);
      res.status(500).json({ message: "Internal server error during registration", error: err.message });
    }
  });

  // Vehicles
  app.get("/api/vehicles", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (!error) return res.json(data);
      // Only log if it's not a "table not found" error (42P01 or PGRST205)
      if (error.code !== '42P01' && error.code !== 'PGRST205') {
        console.error("Supabase Vehicles Error:", error.message, error.code);
      }
    }
    res.json(mockVehicles);
  });

  app.post("/api/vehicles", authenticateToken, async (req, res) => {
    const payload = { ...req.body };
    delete payload.id; // Let DB generate UUID
    if (supabase) {
      const { data, error } = await supabase.from('vehicles').insert([payload]).select();
      if (!error) return res.status(201).json(data[0]);
      console.error("Supabase Create Vehicle Error:", error.message, error.code);
      return res.status(400).json({ message: error.message });
    }
    const newVehicle = { ...payload, id: Date.now().toString() };
    mockVehicles.push(newVehicle);
    res.status(201).json(newVehicle);
  });

  app.put("/api/vehicles/:id", authenticateToken, async (req, res) => {
    const payload = { ...req.body };
    delete payload.id; // Don't update primary key
    if (supabase) {
      const { data, error } = await supabase.from('vehicles').update(payload).eq('id', req.params.id).select();
      if (!error) return res.json(data[0]);
      console.error("Supabase Update Vehicle Error:", error.message, error.code);
      return res.status(400).json({ message: error.message });
    }
    const index = mockVehicles.findIndex(v => v.id === req.params.id);
    if (index !== -1) {
      mockVehicles[index] = { ...mockVehicles[index], ...payload };
      res.json(mockVehicles[index]);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  });

  app.delete("/api/vehicles/:id", authenticateToken, async (req, res) => {
    if (supabase) {
      const { error } = await supabase.from('vehicles').delete().eq('id', req.params.id);
      if (!error) return res.sendStatus(204);
      console.error("Supabase Delete Vehicle Error:", error.message, error.code);
      return res.status(400).json({ message: error.message });
    }
    mockVehicles = mockVehicles.filter(v => v.id !== req.params.id);
    res.sendStatus(204);
  });

  // Bookings
  app.get("/api/bookings", authenticateToken, async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (!error) return res.json(data);
      if (error.code !== '42P01' && error.code !== 'PGRST205') {
        console.error("Supabase Bookings Error:", error.message, error.code);
      }
    }
    res.json(mockBookings);
  });

  app.post("/api/bookings", async (req, res) => {
    const bookingData = { ...req.body, status: 'pending', created_at: new Date().toISOString() };
    if (supabase) {
      const { data, error } = await supabase.from('bookings').insert([bookingData]).select();
      if (!error) return res.status(201).json(data[0]);
      console.error("Supabase Create Booking Error:", error.message, error.code);
      return res.status(400).json({ message: error.message });
    }
    const newBooking = { ...bookingData, id: Date.now().toString() };
    mockBookings.push(newBooking);
    res.status(201).json(newBooking);
  });

  app.patch("/api/bookings/:id/status", authenticateToken, async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('bookings').update({ status: req.body.status }).eq('id', req.params.id).select();
      if (!error) return res.json(data[0]);
      console.error("Supabase Update Booking Error:", error.message, error.code);
      return res.status(400).json({ message: error.message });
    }
    const booking = mockBookings.find(b => b.id === req.params.id);
    if (booking) {
      booking.status = req.body.status;
      res.json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  });

  // Reviews
  app.get("/api/reviews", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('reviews').select('*');
      if (!error) return res.json(data);
      if (error.code !== '42P01' && error.code !== 'PGRST205') {
        console.error("Supabase Reviews Error:", error.message, error.code);
      }
    }
    res.json(mockReviews);
  });

  // Content
  app.get("/api/content", async (req, res) => {
    if (supabase) {
      const { data, error } = await supabase.from('site_content').select('*').limit(1);
      if (!error && data && data.length > 0) return res.json(data[0].content);
      if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
        console.error("Supabase Content Error:", error.message, error.code);
      }
    }
    res.json(mockSiteContent);
  });

  app.post("/api/content", authenticateToken, async (req, res) => {
    if (supabase) {
      // Try to update the first row, or insert if it doesn't exist
      const { data: existing, error: fetchError } = await supabase.from('site_content').select('id').limit(1);
      let result;
      if (!fetchError && existing && existing.length > 0) {
        result = await supabase.from('site_content').update({ content: req.body }).eq('id', existing[0].id).select();
      } else {
        result = await supabase.from('site_content').insert([{ content: req.body }]).select();
      }
      
      if (!result.error) return res.json(result.data[0].content);
      console.error("Supabase Save Content Error:", result.error.message, result.error.code);
      return res.status(400).json({ message: result.error.message });
    }
    mockSiteContent = { ...mockSiteContent, ...req.body };
    res.json(mockSiteContent);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
