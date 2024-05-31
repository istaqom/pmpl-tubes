const request = require("supertest");
const app = require("../index");

describe("Login Endpoint", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app).post("/api/v1/login").send({
      email: "wira@gmail.com",
      password: "12345678",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 400 if login credentials are invalid", async () => {
    const res = await request(app).post("/api/v1/login").send({
      email: "monke@gmail.com",
      password: "1234",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error", "Failed to login");
  });

  it("should return 400 if some params are empty", async () => {
    const res = await request(app)
      .post("/api/v1/login")
      .send({ email: "", password: "12345678" });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      "error",
      "One or more required attributes are missing or empty"
    );
  });
});
