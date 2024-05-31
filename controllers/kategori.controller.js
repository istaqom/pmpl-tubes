const db = require("../config/db");

exports.insertKategori = async (req, res) => {
  try {
    if (!req.body || !req.body.nama) {
      return res.status(400).json({ error: "Body empty" });
    }

    const { nama } = req.body;

    if (!nama.trim()) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    if (nama.length >= 255) {
      return res
        .status(400)
        .json({ error: "Kategori name cannot exceed 255 characters" });
    }

    const insert = await db.query("INSERT INTO kategori(nama) VALUES(?)", [
      nama,
    ]);

    // Return success response
    return res
      .status(201)
      .json({ msg: "Successfully created kategori", id: insert.insertId });
  } catch (error) {
    // Handle errors
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).json({ error: "Failed to insert kategori" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllKategori = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const kategori = await db.query("SELECT * FROM kategori LIMIT ? OFFSET ?", [
      `${limit}`,
      `${offset}`,
    ]);

    if (kategori.length === 0) {
      return res.status(404).json({ msg: "There is no data in kategori" });
    }

    const kategoriCount = await db.query(
      "SELECT COUNT(*) AS total FROM kategori"
    );

    return res.status(200).json({
      msg: "Successfully get all kategori",
      total: kategoriCount[0].total,
      data: kategori,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.getOneKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await db.query("SELECT * FROM kategori WHERE id=?", [id]);

    // Check if data is found
    if (kategori.length === 0) {
      return res.status(404).json({ msg: "Data not found in kategori" });
    }

    return res.status(200).json({
      msg: "Successfully get kategori",
      data: kategori[0],
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.searchKategori = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const kategori = await db.query(
      "SELECT * FROM kategori WHERE nama LIKE ? LIMIT ? OFFSET ?",
      [`%${keyword}%`, `${limit}`, `${offset}`]
    );

    if (kategori.length === 0) {
      return res.status(404).json({ msg: "Data not found in kategori" });
    }

    const kategoriCount = await db.query(
      "SELECT COUNT(*) AS total FROM kategori"
    );

    return res.status(200).json({
      msg: "Successfully found kategori",
      total: kategoriCount[0].total,
      data: kategori,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.editKategori = async (req, res) => {
  try {
    if (!req.body || !req.body.nama) {
      return res.status(400).json({ error: "Body empty" });
    }

    const { id } = req.params;
    const { nama } = req.body;

    if (!nama.trim()) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const existingKategori = await db.query(
      "SELECT * FROM kategori WHERE nama=? AND id!=?",
      [nama, id]
    );
    if (existingKategori.length > 0) {
      return res.status(500).json({ error: "Failed to update kategori" });
    }

    await db.query("UPDATE kategori SET nama=? WHERE id=?", [nama, id]);

    return res.status(200).json({ msg: "Successfully updating kategori" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const existingKategori = await db.query(
      "SELECT * FROM kategori WHERE id=?",
      [id]
    );
    if (existingKategori.length === 0) {
      return res.status(400).json({ error: "Data not exists in kategori" });
    }

    await db.query("DELETE FROM kategori WHERE id=?", [id]);

    return res.status(200).json({ msg: "Successfully deleting kategori" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
