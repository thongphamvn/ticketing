import request from "supertest";
import { app } from "../../app";

it("returns 201 on successful signup", async () => {
  return request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(201);
});

it("returns 400 with invalid email", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test.com", password: "123123123" })
    .expect(400);
});

it("returns 400 duplicated email", async () => {
  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(201);

  await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(400);
});

it("set cookie after successful signup", async () => {
  const res = await request(app)
    .post(`/api/users/signup`)
    .send({ email: "test@test.com", password: "123123123" })
    .expect(201);

  expect(res.get("Set-Cookie")).toBeDefined();
});
