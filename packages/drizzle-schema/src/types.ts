import { InferModel } from "drizzle-orm/mysql-core/table";
import { sessions, users } from "./schema";

export type User = InferModel<typeof users>;

export type Session = InferModel<typeof sessions>;
