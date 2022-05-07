import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "aaa";

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const signin = async () => {
  const email = "test@test.com";
  const password = "123123";

  const res = await request(app)
    .post(`/api/users/signup`)
    .send({ email, password })
    .expect(201);

  const cookie = res.get("Set-Cookie");
  return cookie;
};
