const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../index");

const authToken = process.env.VALID_TOKEN;
const invalidToken = process.env.INVALID_TOKEN;

var barangId;
var kategoriId;

describe("Barang API Endpoints", () => {
  it("should insert data to barang with valid data", async () => {
    const kategori = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama: "Elektronik" });
    kategoriId = kategori.body.id;

    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama: "Barang Test" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("msg", "Successfully created barang");
    barangId = res.body.id;
  });

  it("should return 400 if inserting data to barang with invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Body empty");
  });

  it("should return 400 if inserting data to barang with empty id_kategori", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ nama: "Barang Test" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });

  it("should return 400 if inserting data to barang with empty nama", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });

  it("should return 500 if inserting duplicate data to barang", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama: "Barang Test" });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("error", "Failed to insert barang");
  });

  it("should return 400 if inserting data to barang with length exceeding 255", async () => {
    const nama =
      "jiofssjldkfsdijofsioufseoifjsieoufjsuioehjfuieshuifhsuiehfiohseufhueshwfuihseuihfuishiefhuishfuihseuifhuisehuifhseuihfuisehfuisehuifhesuifhusiehfisehiufhesuifhuieshfuisehuifhesiuhfsuiehfuieshfuisehuifhesuihfuisehfuieshuifhseuifhuisehuihfeuishfuieshfuuihiuh";
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "Barang name cannot exceed 255 characters"
    );
  });

  it("should return 401 if inserting data to barang without logged in", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .send({ id_kategori: kategoriId, nama: "Barang Test" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should return 401 if inserting data to barang without the correct role", async () => {
    const res = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", invalidToken)
      .send({ id_kategori: kategoriId, nama: "Barang Test" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should get all data from barang with a valid data", async () => {
    const res = await request(app)
      .get("/api/v1/barang")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully get all barang");
  });

  it("should return 404 if getting all data from barang while the table is empty", async () => {
    const del = await request(app)
      .delete(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken);

    const res = await request(app)
      .get("/api/v1/barang")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("msg", "There is no data in barang");
  });

  it("should get one data from barang with a valid id", async () => {
    const insert = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama: "Barang Test" });
    barangId = insert.body.id;

    const res = await request(app)
      .get(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully get barang");
  });

  it("should return 404 if getting one data from barang with an invalid id", async () => {
    const res = await request(app)
      .get("/api/v1/barang/999999")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("msg", "Data not found in barang");
  });

  it("should get one data from barang using search and got valid data", async () => {
    const res = await request(app)
      .get("/api/v1/barang/search/Barang Test")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully found barang");
  });

  it("should return 404 if getting one data from barang using search and got invalid data", async () => {
    const res = await request(app)
      .get("/api/v1/barang/search/NonExisting")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("msg", "Data not found in barang");
  });

  // Editing data inside barang
  it("should edit data inside barang with valid data", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama: "New Barang Name" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully updating barang");
  });

  it("should return 400 if editing data inside barang with invalid body", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Body empty");
  });

  it("should return 400 if editing data inside barang with empty id_kategori", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken)
      .send({ nama: "New Barang Name" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });

  it("should return 400 if editing data inside barang with empty nama", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });

  it("should return 500 if editing data inside barang with data that already exists in database", async () => {
    const insert = await request(app)
      .post("/api/v1/barang")
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama: "Barang Test" });

    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken)
      .send({ id_kategori: kategoriId, nama: "Barang Test" });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("error", "Failed to update barang");

    const del = await request(app)
      .delete(`/api/v1/barang/${insert.body.id}`)
      .set("Authorization", authToken);
  });

  it("should return 401 if editing data to barang without logged in", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .send({ id_kategori: kategoriId, nama: "New Barang Name" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should return 401 if editing data to barang without the correct role", async () => {
    const res = await request(app)
      .put(`/api/v1/barang/${barangId}`)
      .set("Authorization", invalidToken)
      .send({ id_kategori: kategoriId, nama: "New Barang Name" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  // Deleting data from barang
  it("should delete data from barang with correct id", async () => {
    const res = await request(app)
      .delete(`/api/v1/barang/${barangId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully deleting barang");

    const deleteKategori = await request(app)
      .delete(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken);
  });

  it("should return 400 if deleting data from barang with invalid id", async () => {
    const res = await request(app)
      .delete("/api/v1/barang/999999")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Data not exists in barang");
  });

  it("should return 401 if deleting data from barang without logged in", async () => {
    const res = await request(app).delete(`/api/v1/barang/${barangId}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should return 401 if deleting data from barang without the correct role", async () => {
    const res = await request(app)
      .delete(`/api/v1/barang/${barangId}`)
      .set("Authorization", invalidToken);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });
});
