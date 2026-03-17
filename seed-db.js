import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function seed() {
  try {
    await client.connect();
    
    // Check if vehicles exist
    const res = await client.query('SELECT COUNT(*) FROM vehicles');
    if (parseInt(res.rows[0].count) === 0) {
      console.log("Seeding vehicles...");
      await client.query(`
        INSERT INTO vehicles (name, category, "pricePerDay", transmission, seats, "fuelType", description, images, specs)
        VALUES 
        ('Range Rover Vogue', 'Luxury', 2500, 'Automatic', 5, 'Diesel', 'The ultimate luxury SUV for your comfort.', ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000'], '{"engine": "3.0L V6", "ac": true, "gps": true}'),
        ('Mercedes G-Class', 'Luxury', 3500, 'Automatic', 5, 'Essence', 'Iconic design and unmatched performance.', ARRAY['https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=1000'], '{"engine": "4.0L V8", "ac": true, "gps": true}'),
        ('Dacia Duster', 'SUV', 450, 'Manual', 5, 'Diesel', 'Reliable and efficient for all terrains.', ARRAY['https://images.unsplash.com/photo-1619103462214-60144943960c?auto=format&fit=crop&q=80&w=1000'], '{"engine": "1.5L dCi", "ac": true, "gps": false}')
      `);
    }

    // Check if site_content exists
    const contentRes = await client.query('SELECT COUNT(*) FROM site_content');
    if (parseInt(contentRes.rows[0].count) === 0) {
      console.log("Seeding site content...");
      await client.query(`
        INSERT INTO site_content (content)
        VALUES ('{"hero": {"en": {"title": "Drive Your Journey in Style", "subtitle": "Premium car rental for tourists and business travelers in Morocco."}, "fr": {"title": "Conduisez avec Style", "subtitle": "Location de voitures premium pour touristes et voyageurs d''affaires au Maroc."}}, "about": {"en": "FAAM Rent Car provides reliable and comfortable vehicles for your stay in Morocco.", "fr": "FAAM Rent Car propose des véhicules fiables et confortables pour votre séjour au Maroc."}}')
      `);
    }

    // Check if admin exists
    const userRes = await client.query("SELECT * FROM users WHERE email = 'admin@faam.com'");
    const hashedPassword = await bcrypt.hash("Faam2026", 10);
    if (userRes.rows.length === 0) {
      console.log("Seeding admin user...");
      await client.query(`
        INSERT INTO users (email, password, role)
        VALUES ('admin@faam.com', $1, 'Super Admin')
      `, [hashedPassword]);
    } else {
      console.log("Updating admin password...");
      await client.query(`
        UPDATE users SET password = $1 WHERE email = 'admin@faam.com'
      `, [hashedPassword]);
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.end();
  }
}

seed();
