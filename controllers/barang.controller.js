const db = require("../config/db");

exports.insertBarang = async (req, res) => {
  try {
    if (!req.body.id_kategori && !req.body.nama) {
      return res.status(400).json({
        error: "Body empty",
      });
    }

    if (!req.body.id_kategori || !req.body.nama) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const { id_kategori, nama } = req.body;

    if (!nama.trim() || !id_kategori) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    if (nama.length >= 255) {
      return res
        .status(400)
        .json({ error: "Barang name cannot exceed 255 characters" });
    }

    const existingBarang = await db.query(
      "SELECT * FROM barang WHERE nama=? AND id_kategori=?",
      [nama, id_kategori]
    );
    if (existingBarang.length > 0) {
      return res.status(500).json({ error: "Failed to insert barang" });
    }

    const insert = await db.query(
      "INSERT INTO barang(id_kategori, nama) VALUES(?, ?)",
      [id_kategori, nama]
    );

    return res
      .status(201)
      .json({ msg: "Successfully created barang", id: insert.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// barang.controller.js

exports.getAllBarang = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const barang = await db.query(
      "SELECT b.id, b.id_kategori, k.nama as nama_kategori, b.nama, COUNT(d.id_barang) AS detail_count FROM barang b LEFT JOIN detail_barang d ON b.id = d.id_barang LEFT JOIN kategori k ON b.id_kategori = k.id GROUP BY b.id, b.id_kategori, b.nama LIMIT ? OFFSET ?",
      [`${limit}`, `${offset}`]
    );

    if (barang.length === 0) {
      return res.status(404).json({ msg: "There is no data in barang" });
    }

    const barangCount = await db.query("SELECT COUNT(*) AS total FROM barang");

    return res.status(200).json({
      msg: "Successfully get all barang",
      total: barangCount[0].total,
      data: barang,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOneBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const barang = await db.query(
      "SELECT b.id, b.id_kategori, k.nama as nama_kategori, b.nama, COUNT(d.id_barang) AS detail_count FROM barang b LEFT JOIN detail_barang d ON b.id = d.id_barang LEFT JOIN kategori k ON b.id_kategori = k.id GROUP BY b.id, b.id_kategori, b.nama WHERE id=?",
      [id]
    );

    if (barang.length === 0) {
      return res.status(404).json({ msg: "Data not found in barang" });
    }

    return res.status(200).json({
      msg: "Successfully get barang",
      data: barang[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchBarang = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const barang = await db.query(
      "SELECT b.id, b.id_kategori, k.nama AS nama_kategori, b.nama, COUNT(d.id_barang) AS detail_count FROM barang b LEFT JOIN detail_barang d ON b.id = d.id_barang LEFT JOIN kategori k ON b.id_kategori = k.id WHERE b.nama LIKE ? GROUP BY b.id, b.id_kategori, k.nama, b.nama LIMIT ? OFFSET ?",
      [`%${keyword}%`, `${limit}`, `${offset}`]
    );

    if (barang.length === 0) {
      return res.status(404).json({ msg: "Data not found in barang" });
    }

    const barangCount = await db.query("SELECT COUNT(*) AS total FROM barang");

    return res.status(200).json({
      msg: "Successfully found barang",
      total: barangCount[0].total,
      data: barang,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editBarang = async (req, res) => {
  try {
    if (!req.body.id_kategori && !req.body.nama) {
      return res.status(400).json({
        error: "Body empty",
      });
    }

    if (!req.body.id_kategori || !req.body.nama) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const { id } = req.params;
    const { id_kategori, nama } = req.body;

    if (!nama.trim() || !id_kategori) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const existingBarang = await db.query(
      "SELECT * FROM barang WHERE nama=? AND id_kategori=? AND id!=?",
      [nama, id_kategori, id]
    );
    if (existingBarang.length > 0) {
      return res.status(500).json({ error: "Failed to update barang" });
    }

    await db.query("UPDATE barang SET id_kategori=?, nama=? WHERE id=?", [
      id_kategori,
      nama,
      id,
    ]);

    return res.status(200).json({ msg: "Successfully updating barang" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteBarang = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBarang = await db.query("SELECT * FROM barang WHERE id=?", [
      id,
    ]);
    if (existingBarang.length === 0) {
      return res.status(400).json({ error: "Data not exists in barang" });
    }

    await db.query("DELETE FROM barang WHERE id=?", [id]);

    return res.status(200).json({ msg: "Successfully deleting barang" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
