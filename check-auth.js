import pkg from 'pg';
const { Client } = pkg;
import 'dotenv/config';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

async function check() {
  try {
    await client.connect();
    const res = await client.query("SELECT * FROM users WHERE email = 'admin@faam.com'");
    if (res.rows.length === 0) {
      console.log("User admin@faam.com not found in database.");
    } else {
      const user = res.rows[0];
      console.log("User found:", user.email);
      const match = await bcrypt.compare("Faam2026", user.password);
      console.log("Password match check for 'Faam2026':", match);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

check();
