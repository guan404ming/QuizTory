import {
    index,
    integer,
    pgTable,
    serial,
    varchar,
} from "drizzle-orm/pg-core";

export const USER = pgTable("USER",
    {
        id: serial("id").primaryKey(),
        email: varchar("email", { length: 50 }).notNull().unique(),
        name: varchar("name", { length: 50 }).notNull(),
    },
    (table) => ({
        emailIndex: index("email_index").on(table.email),
    }),
);

export const USER_ROLE = pgTable("USER_ROLE",
    {
        id: serial("id").primaryKey(),
        role: varchar("role", { enum: ["Admin", "Blocked"] }).notNull(),
        user_id: integer("user_id")
            .notNull()
            .references(() => USER.id, { onDelete: "cascade" }),
    },
);

export const INSTRUCTOR = pgTable("INSTRUCTOR",
    {
        id: serial("id").primaryKey(),
        name: varchar("name").notNull().unique(),
        department_name: varchar("department_name", { length: 20 }).notNull(),
    },
    (table) => ({
        nameIndex: index("name").on(table.name),
    }),
);

export const COURSE = pgTable("COURSE",
    {
        id: varchar("id").notNull().primaryKey(),
        name: varchar("name").notNull(),
        semester: varchar("semester", { length: 50 }).notNull(),
        instructor_id: integer("instructor_id")
            .notNull()
            .references(() => INSTRUCTOR.id, { onDelete: "cascade" }),
    },
    (table) => ({
        semesterIndex: index("semester").on(table.semester),
    }),
);

export const FILE = pgTable("FILE",
    {
        id: serial("id").primaryKey(),
        content_type: varchar("content_type", { enum: ["Solution", "Question", "Q&S"] }).notNull(),
        exam_type: varchar("exam_type", { enum: ["Quiz", "Midterm", "Final"] }).notNull(),
        status: varchar("status", { enum: ["Public", "Private"] }).notNull(),
        downloadURL: varchar("downloadURL"),
        course_id: varchar("course_id")
            .notNull()
            .references(() => COURSE.id, { onDelete: "cascade" }),

        user_id: integer("user_id")
            .notNull()
            .references(() => USER.id, { onDelete: "cascade" }),
    },
);
