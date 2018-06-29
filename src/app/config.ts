import * as dotenv from "dotenv";
import * as functions from "firebase-functions";

dotenv.load();

export const marqetaUrl = process.env.MARQETA || functions.config().marqeta.url;

export const port = process.env.PORT || 3001;

export const databaseUrl = process.env.DATABASE_URL || functions.config().database.url;

export const logLevel = process.env.LOG_LEVEL || functions.config().log.level;
