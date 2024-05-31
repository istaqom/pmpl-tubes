const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const dasbor = await db.query(
      "SELECT (SELECT COUNT(*) FROM kategori) AS kategori_count, (SELECT COUNT(*) FROM barang) AS barang_count, (SELECT COUNT(*) FROM detail_barang) AS detail_barang_count",
      []
    );

    return res.status(200).json({
      msg: "Successfully get all barang",
      data: dasbor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
