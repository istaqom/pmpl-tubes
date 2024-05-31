// detail_barang.controller.js
const db = require("../config/db");

exports.insertDetailBarang = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Body empty",
      });
    }

    if (
      !req.body.id_barang ||
      !req.body.serial_number ||
      !req.body.gedung_lokasi_barang ||
      req.body.ruang_lokasi_barang === undefined ||
      req.body.can_borrow === undefined
    ) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const {
      id_barang,
      serial_number,
      gedung_lokasi_barang,
      ruang_lokasi_barang,
      can_borrow,
    } = req.body;

    const existingDetailBarang = await db.query(
      "SELECT * FROM detail_barang WHERE serial_number=? AND id_barang=?",
      [serial_number, id_barang]
    );
    if (existingDetailBarang.length > 0) {
      return res.status(500).json({ error: "Failed to insert detail_barang" });
    }

    const insert = await db.query(
      "INSERT INTO detail_barang(id_barang, serial_number, gedung_lokasi_barang, ruang_lokasi_barang, can_borrow) VALUES(?, ?, ?, ?, ?)",
      [
        id_barang,
        serial_number,
        gedung_lokasi_barang,
        ruang_lokasi_barang,
        can_borrow,
      ]
    );

    return res
      .status(201)
      .json({ msg: "Successfully created detail_barang", id: insert.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllDetailBarang = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const detailBarang = await db.query(
      "SELECT * FROM detail_barang LIMIT ? OFFSET ?",
      [`${limit}`, `${offset}`]
    );

    if (detailBarang.length === 0) {
      return res.status(404).json({ msg: "There is no data in detail_barang" });
    }

    return res.status(200).json({
      msg: "Successfully get all detail_barang",
      data: detailBarang,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOneDetailBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const detailBarang = await db.query(
      "SELECT * FROM detail_barang WHERE id=?",
      [id]
    );

    if (detailBarang.length === 0) {
      return res.status(404).json({ msg: "Data not found in detail_barang" });
    }

    return res
      .status(200)
      .json({ msg: "Successfully get detail_barang", data: detailBarang[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editDetailBarang = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Body empty",
      });
    }

    if (
      !req.body.id_barang ||
      !req.body.serial_number ||
      !req.body.gedung_lokasi_barang ||
      req.body.ruang_lokasi_barang === undefined ||
      req.body.can_borrow === undefined
    ) {
      return res.status(400).json({
        error: "One or more required attributes are missing or empty",
      });
    }

    const { id } = req.params;
    const {
      id_barang,
      serial_number,
      gedung_lokasi_barang,
      ruang_lokasi_barang,
      can_borrow,
    } = req.body;

    const existingDetailBarang = await db.query(
      "SELECT * FROM detail_barang WHERE serial_number=? AND id_barang=? AND id!=?",
      [serial_number, id_barang, id]
    );
    if (existingDetailBarang.length > 0) {
      return res.status(500).json({ error: "Failed to update detail_barang" });
    }

    await db.query(
      "UPDATE detail_barang SET id_barang=?, serial_number=?, gedung_lokasi_barang=?, ruang_lokasi_barang=?, can_borrow=? WHERE id=?",
      [
        id_barang,
        serial_number,
        gedung_lokasi_barang,
        ruang_lokasi_barang,
        can_borrow,
        id,
      ]
    );

    return res.status(200).json({ msg: "Successfully updating detail_barang" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteDetailBarang = async (req, res) => {
  try {
    const { id } = req.params;

    const existingDetailBarang = await db.query(
      "SELECT * FROM detail_barang WHERE id=?",
      [id]
    );
    if (existingDetailBarang.length === 0) {
      return res
        .status(400)
        .json({ error: "Data not exists in detail_barang" });
    }

    await db.query("DELETE FROM detail_barang WHERE id=?", [id]);

    return res.status(200).json({ msg: "Successfully deleting detail_barang" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchDetailBarangSN = async (req, res) => {
  try {
    const { serial_number } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const detailBarang = await db.query(
      "SELECT * FROM detail_barang WHERE serial_number LIKE ? LIMIT ? OFFSET ?",
      [`%${serial_number}%`, `${limit}`, `${offset}`]
    );

    if (detailBarang.length === 0) {
      return res.status(404).json({ msg: "Data not found in detail_barang" });
    }

    return res.status(200).json({
      msg: "Successfully found detail_barang",
      data: detailBarang,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
