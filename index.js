const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const port = process.env.APP_PORT;
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/ping", (req, res) => {
  return res.send("Pong!");
});

const AuthRoutes = require("./routers/auth.router");
const KategoriRoutes = require("./routers/kategori.router");
const BarangRoutes = require("./routers/barang.router");
const DetailBarangRoutes = require("./routers/detail_barang.router");
const DashboardRoutes = require("./routers/dashboard.router");

app.use("/api/v1", AuthRoutes);
app.use("/api/v1/kategori", KategoriRoutes);
app.use("/api/v1/barang", BarangRoutes);
app.use("/api/v1/detail_barang", DetailBarangRoutes);
app.use("/api/v1/dashboard", DashboardRoutes);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`App running in port ${port}`);
  });
}

module.exports = app;
