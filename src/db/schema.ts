import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  varchar,
  unique,
  timestamp,
} from "drizzle-orm/pg-core";

// user related

export const userTable = pgTable(
  "USER",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 50 }).notNull(),
  },
  (table) => ({
    emailIndex: index("email_index").on(table.email),
  }),
);

export const userRoleTable = pgTable("USER_ROLE", {
  id: serial("id").primaryKey(),
  role: varchar("role", { enum: ["Admin", "Blocked", "Normal"] }).notNull(),
  userId: integer("user_id")
    .unique()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const commentTable = pgTable(
  "COMMENT",
  {
    id: serial("comment_id").primaryKey(),
    content: varchar("comment_content", { length: 200 }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
    userId: serial("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    fileId: serial("file_id")
      .notNull()
      .references(() => fileTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    fileIdIndex: index("file_id_index").on(table.fileId),
  }),
);

// admin related

export const settingTable = pgTable(
  "SETTING",
  {
    setting_id: serial("setting_id").primaryKey(),
    type: varchar("setting_type", {
      enum: ["Set_public", "Set_private"],
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
    userId: serial("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
  }),
);

export const activityRecordTable = pgTable(
  "ACTIVITY_RECORD",
  {
    id: serial("activity_id").primaryKey(),
    type: varchar("activity_type", {
      enum: ["SIGN_IN", "SIGN_OUT"],
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
    userId: serial("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
  }),
);

export const announcementTable = pgTable(
  "ANNOUNCEMENT",
  {
    id: serial("announcement_id").primaryKey(),
    userId: serial("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    content: varchar("announcement_content", {
      length: 200,
    }).notNull(),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
  }),
);

export const roleChangedRecordTable = pgTable(
  "ROLE_CHANGED_RECORD",
  {
    id: serial("changed_record_id").primaryKey(),
    from: varchar("from_role", {
      enum: ["Admin", "Blocked", "Normal"],
    }).notNull(),
    to: varchar("to_role", {
      enum: ["Admin", "Blocked", "Normal"],
    }).notNull(),

    createdAt: timestamp("created_at").default(sql`now()`),
    changerId: serial("changer_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    changeeId: serial("changee_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    changerIdIndex: index("changer_id_index").on(table.changerId),
    changeeIdIndex: index("changee_id_index").on(table.changeeId),
  }),
);

// course related

export const instructorTable = pgTable(
  "INSTRUCTOR",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull().unique(),
    departmentName: varchar("department_name", { length: 20 }).notNull(),
  },
  (table) => ({
    nameIndex: index("name").on(table.name),
  }),
);

export const courseTable = pgTable(
  "COURSE",
  {
    id: serial("id").primaryKey(),
    number: varchar("number").notNull(),
    name: varchar("name").notNull(),
    semester: varchar("semester", { length: 50 }).notNull(),
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => instructorTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    numberIndex: index("number").on(table.number),
    unique: unique().on(table.number, table.instructorId),
  }),
);

export const fileTable = pgTable("FILE", {
  id: serial("id").primaryKey(),
  contentType: varchar("content_type", {
    enum: ["Solution", "Question", "Q&S"],
  }).notNull(),
  examType: varchar("exam_type", {
    enum: ["Quiz", "Midterm", "Final"],
  }).notNull(),
  status: varchar("status", { enum: ["Public", "Private"] }).notNull(),
  downloadURL: varchar("downloadURL"),
  courseId: integer("course_id")
    .notNull()
    .references(() => courseTable.id, { onDelete: "cascade" }),

  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});
