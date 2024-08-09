import * as dotenv from "dotenv";
dotenv.config();

const { MONGO_URI, FRONTEND_URI, PORT, SECRET } = process.env;

export { MONGO_URI, FRONTEND_URI, PORT, SECRET };