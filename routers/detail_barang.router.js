const DetailBarangController = require("../controllers/detail_barang.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

const router = require("express").Router();

router.use(AuthMiddleware.authenticateUser, AuthMiddleware.authorizeAdmin);

router.post("/", DetailBarangController.insertDetailBarang);
router.get("/", DetailBarangController.getAllDetailBarang);
router.get("/:id", DetailBarangController.getOneDetailBarang);
router.get("/search/sn/:serial_number", DetailBarangController.searchDetailBarangSN);
router.put("/:id", DetailBarangController.editDetailBarang);
router.delete("/:id", DetailBarangController.deleteDetailBarang);

module.exports = router;
