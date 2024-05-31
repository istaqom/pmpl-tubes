const DashboardController = require("../controllers/dashboard.controller");
const router = require("express").Router();

router.get("/", DashboardController.getDashboard);

module.exports = router;
