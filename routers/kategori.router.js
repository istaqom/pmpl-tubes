const KategoriController = require("../controllers/kategori.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

const router = require("express").Router();

router.use(
  AuthMiddleware.authenticateUser,
  AuthMiddleware.authorizeAdmin
);

router.post("/", KategoriController.insertKategori);
router.get("/", KategoriController.getAllKategori);
router.get("/:id", KategoriController.getOneKategori);
router.get("/search/:keyword", KategoriController.searchKategori);
router.put("/:id", KategoriController.editKategori);
router.delete("/:id", KategoriController.deleteKategori);

module.exports = router;
