import { createServer } from "http";
import { handler } from "./routes";

export default createServer(handler);
