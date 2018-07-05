import * as dotenv from "dotenv";
import * as functions from "firebase-functions";
import { DatabaseCollectionNames } from "./database/DatabaseClient";

dotenv.load();

export const marqetaUrl = process.env.MARQETA || functions.config().marqeta.url;

export const port = process.env.PORT || 3001;

export const logLevel = process.env.LOG_LEVEL || functions.config().log.level;

export const databaseCollectionNames: DatabaseCollectionNames = {
    permissions: process.env.DATABASE_PERMISSIONS || functions.config().database.permissions,
    users: process.env.DATABASE_USERS || functions.config().database.users,
    waitlist: process.env.DATABASE_WAITLIST || functions.config().database.waitlist,
};
