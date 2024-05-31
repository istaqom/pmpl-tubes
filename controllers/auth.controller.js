const dotenv = require("dotenv");
dotenv.config();

const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { nama, password, role, pekerjaan, nomor_pengenal, nomor_wa, email } =
      req.body;

    // Check if required fields are provided
    if (!nama || !password || !role || !pekerjaan || !nomor_pengenal) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    // Check if nomor_pengenal already exists
    const existingUser = await db.query(
      "SELECT * FROM user WHERE nomor_pengenal=?",
      [nomor_pengenal]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this nomor_pengenal already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    await db.query(
      "INSERT INTO user (nama, password, role, pekerjaan, nomor_pengenal, nomor_wa, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nama, hashedPassword, role, pekerjaan, nomor_pengenal, nomor_wa, email]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const user = await db.query("SELECT * FROM user WHERE email=?", [email]);
    if (user.length === 0) {
      return res.status(400).json({ error: "Failed to login" });
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Password incorrect" });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        nama: user[0].nama,
        email: user[0].email,
        role: user[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Successfully logging in", token });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
