import fs from "fs";
import fsPromises from "fs/promises";
import config from "./config.js";
import { join, extname } from "path";
const {
  dir: { publicDirectory },
} = config;
export class Service {
  createFileStream(filename) {
    return fs.createReadStream(filename);
  }

  async getFileInfo(filename) {
    const fullFilePath = join(publicDirectory, filename);
    // check if exists, if doesn't this will throw an error
    await fsPromises.access(fullFilePath);
    const fileType = extname(fullFilePath);

    return {
      type: fileType,
      name: fullFilePath,
    };
  }

  async getFileStream(filename) {
    const { name, type } = await this.getFileInfo(filename);

    return {
      stream: this.createFileStream(name),
      type,
    };
  }
}
