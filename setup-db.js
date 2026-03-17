import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function setup() {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");

    // Create vehicles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        "pricePerDay" INTEGER NOT NULL,
        transmission TEXT NOT NULL,
        seats INTEGER NOT NULL,
        "fuelType" TEXT NOT NULL,
        description TEXT NOT NULL,
        images TEXT[] NOT NULL,
        specs JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Created vehicles table");

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "vehicleId" TEXT NOT NULL,
        "vehicleName" TEXT NOT NULL,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "pickupDate" TEXT NOT NULL,
        "returnDate" TEXT NOT NULL,
        "totalPrice" INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Created bookings table");

    // Create reviews table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Created reviews table");

    // Create site_content table
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Created site_content table");

    console.log("Database setup complete!");
  } catch (err) {
    console.error("Error setting up database:", err);
  } finally {
    await client.end();
  }
}

setup();
