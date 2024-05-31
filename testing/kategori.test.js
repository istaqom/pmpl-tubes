const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../index");

const authToken = process.env.VALID_TOKEN;
const invalidToken = process.env.INVALID_TOKEN;

var kategoriId;

describe("Kategori API Endpoints", () => {
  it("should insert data to kategori with valid data", async () => {
    const res = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama: "Elektronik" });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("msg", "Successfully created kategori");
    kategoriId = res.body.id;
  });

  it("should return 400 if inserting data to kategori with invalid body", async () => {
    const res = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Body empty");
  });

  it("should return 400 if inserting data to kategori with empty nama", async () => {
    const res = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama: " " });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });

  it("should return 500 if inserting duplicate data to kategori", async () => {
    const res = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama: "Elektronik" });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("error", "Failed to insert kategori");
  });

  it("should return 400 if inserting data to kategori with nama exceeding 255 characters", async () => {
    const nama =
      "jiofssjldkfsdijofsioufseoifjsieoufjsuioehjfuieshuifhsuiehfiohseufhueshwfuihseuihfuishiefhuishfuihseuifhuisehuifhseuihfuisehfuisehuifhesuifhusiehfisehiufhesuifhuieshfuisehuifhesiuhfsuiehfuieshfuisehuifhesuihfuisehfuieshuifhseuifhuisehuihfeuishfuieshfuuihiuh";
    const res = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "Kategori name cannot exceed 255 characters"
    );
  });

  it("should return 401 if inserting data to kategori without logged in", async () => {
    const res = await request(app)
      .post("/api/v1/kategori")
      .send({ nama: "Elektronik" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should return 401 if inserting data to kategori without the correct role", async () => {
    const res = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", invalidToken)
      .send({ nama: "Elektronik" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should get all data from kategori with a valid data", async () => {
    const res = await request(app)
      .get("/api/v1/kategori")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully get all kategori");
  });

  it("should return 404 if getting all data from kategori while the table is empty", async () => {
    const del = await request(app)
      .delete(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken);

    const res = await request(app)
      .get("/api/v1/kategori")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("msg", "There is no data in kategori");
  });

  it("should get one data from kategori with a valid id", async () => {
    const insert = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama: "Elektronik" });
    kategoriId = insert.body.id;

    const res = await request(app)
      .get(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully get kategori");
  });

  it("should return 404 if getting one data from kategori with an invalid id", async () => {
    const res = await request(app)
      .get("/api/v1/kategori/999999")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("msg", "Data not found in kategori");
  });

  it("should get one data from kategori using search and got valid data", async () => {
    const res = await request(app)
      .get("/api/v1/kategori/search/Elektronik")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully found kategori");
  });

  it("should return 404 if getting one data from kategori using search and got invalid data", async () => {
    const res = await request(app)
      .get("/api/v1/kategori/search/NonExisting")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("msg", "Data not found in kategori");
  });

  // Editing data inside kategori
  it("should edit data inside kategori with valid data", async () => {
    const res = await request(app)
      .put(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken)
      .send({ nama: "New Name" });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully updating kategori");
  });

  it("should return 400 if editing data inside kategori with invalid body", async () => {
    const res = await request(app)
      .put(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Body empty");
  });

  it("should return 400 if editing data inside kategori with empty nama", async () => {
    const res = await request(app)
      .put(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken)
      .send({ nama: " " });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });

  it("should return 500 if editing data inside kategori with data that already exists in database", async () => {
    const insert = await request(app)
      .post("/api/v1/kategori")
      .set("Authorization", authToken)
      .send({ nama: "Elektronik" });

    const res = await request(app)
      .put(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken)
      .send({ nama: "Elektronik" });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("error", "Failed to update kategori");

    const del = await request(app)
      .delete(`/api/v1/kategori/${insert.body.id}`)
      .set("Authorization", authToken);
  });

  it("should return 401 if editing data to kategori without logged in", async () => {
    const res = await request(app)
      .put(`/api/v1/kategori/${kategoriId}`)
      .send({ nama: "New Name" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should return 401 if editing data to kategori without the correct role", async () => {
    const res = await request(app)
      .put(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", invalidToken)
      .send({ nama: "New Name" });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  // Deleting data from kategori
  it("should delete data from kategori with correct id", async () => {
    const res = await request(app)
      .delete(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("msg", "Successfully deleting kategori");
  });

  it("should return 400 if deleting data from kategori with invalid id", async () => {
    const res = await request(app)
      .delete("/api/v1/kategori/999999")
      .set("Authorization", authToken);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Data not exists in kategori");
  });

  it("should return 401 if deleting data from kategori without logged in", async () => {
    const res = await request(app).delete(`/api/v1/kategori/${kategoriId}`);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });

  it("should return 401 if deleting data from kategori without the correct role", async () => {
    const res = await request(app)
      .delete(`/api/v1/kategori/${kategoriId}`)
      .set("Authorization", invalidToken);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty(
      "error",
      "You don't have access to this endpoint"
    );
  });
});
