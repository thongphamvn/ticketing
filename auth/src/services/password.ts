import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const cryptAsync = promisify(scrypt);
export class Password {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buff = (await cryptAsync(password, salt, 64)) as Buffer;

    return `${buff.toString("hex")}.${salt}`;
  }

  static async compare(
    storedPass: string,
    suppliedPass: string
  ): Promise<boolean> {
    const [hashedPass, salt] = storedPass.split(".");

    const buff = (await cryptAsync(suppliedPass, salt, 64)) as Buffer;
    return buff.toString("hex") === hashedPass;
  }
}
