import {
  index,
  integer,
  pgTable,
  serial,
  varchar,
  unique,
  date,
  time,
} from "drizzle-orm/pg-core";

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
  role: varchar("role", { enum: ["Admin", "Blocked"] }).notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

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

export const commentTable = pgTable(
  "COMMENT",
  {
    id: serial("comment_id").primaryKey(),
    content: varchar("comment_content", { length: 200 }).notNull(),
    date: date("comment_date").notNull(),
    time: time("comment_time").notNull(),
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

export const settingTable = pgTable(
  "SETTING",
  {
    setting_id: serial("setting_id").primaryKey(),
    type: varchar("setting_type", {
      enum: ["Set_public", "Set_private"],
    }).notNull(),
    date: date("setting_date").notNull(),
    time: time("setting_time").notNull(),
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
    type: varchar("activity_type", { length: 20 }).notNull(),
    date: date("activity_date").notNull(),
    time: time("activity_time").notNull(),
    user_id: serial("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.user_id),
  }),
);

export const roleChangedRecord = pgTable(
  "ROLE_CHANGED_RECORD",
  {
    id: serial("changed_record_id").primaryKey(),
    changed_role: varchar("changed_role", {
      enum: ["Admin", "Blocked"],
    }).notNull(),
    changer_action: varchar("changer_action", {
      enum: ["Assigned", "Cancelled"],
    }).notNull(),
    date: date("changed_date").notNull(),
    time: time("changed_time").notNull(),
    changerId: serial("changer_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    changedId: serial("changed_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    changerIdIndex: index("changer_id_index").on(table.changerId),
    changedIdIndex: index("changed_id_index").on(table.changedId),
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
    date: date("announcement_date").notNull(),
    time: time("announcement_time").notNull(),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
  }),
);
