import { Table } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull().unique(),
  description: text("description"),
});

export const enrollments= pgTable("enrollments",{
    id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid().notNull().references(()=>users.id),
  courseId: uuid().notNull().references(()=>courses.id),
 createdAt:timestamp({withTimezone:true}).notNull().defaultNow(),
},Table=>[uniqueIndex().on(Table.userId,Table.courseId)])