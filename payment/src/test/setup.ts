import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "aaa";

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const signin = (id?: string): string[] => {
  // build jwt payload: { id, email }
  const payload = { id: id || "123123", email: "test@test.com" };

  // Create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build session object. { jwt, MY_JWT }
  const session = { jwt: token };

  // turn that session into jSON, encode as base64
  const sessionJson = JSON.stringify(session);
  const encoded = Buffer.from(sessionJson).toString("base64");

  // return
  return [`session=${encoded}`];
};
