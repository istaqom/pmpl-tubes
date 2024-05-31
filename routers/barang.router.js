const BarangController = require("../controllers/barang.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

const router = require("express").Router();

router.use(
  AuthMiddleware.authenticateUser,
  AuthMiddleware.authorizeAdmin
);

router.post("/", BarangController.insertBarang);
router.get("/", BarangController.getAllBarang);
router.get("/:id", BarangController.getOneBarang);
router.get("/search/:keyword", BarangController.searchBarang);
router.put("/:id", BarangController.editBarang);
router.delete("/:id", BarangController.deleteBarang);

module.exports = router;
