import {
    index,
    integer,
    pgTable,
    serial,
    unique,
    varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("USER",
    {
        id: serial("id").primaryKey(),
        email: varchar("email", { length: 50 }).notNull().unique(),
        name: varchar("name", { length: 50 }).notNull(),
    },
    (table) => ({
        emailIndex: index("email_index").on(table.email),
    }),
);

export const userRoleTable = pgTable("USER_ROLE",
    {
        id: serial("id").primaryKey(),
        role: varchar("role", { enum: ["Admin", "Blocked"] }).notNull(),
        userId: integer("user_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
    },
);

export const instructorTable = pgTable("INSTRUCTOR",
    {
        id: serial("id").primaryKey(),
        name: varchar("name").notNull().unique(),
        departmentName: varchar("department_name", { length: 20 }).notNull(),
    },
    (table) => ({
        nameIndex: index("name").on(table.name),
    }),
);

export const courseTable = pgTable("COURSE",
    {
        id: serial("id").primaryKey(),
        number: varchar("number").notNull(),
        name: varchar("name").notNull(),
        semester: varchar("semester", { length: 50 }).notNull(),
        instructorId: integer("instructor_id")
            .notNull()
            .references(() => instructorTable.id, { onDelete: "cascade" })
    },
    (table) => ({
        numberIndex: index("number").on(table.number),
        unique: unique().on(table.number, table.instructorId)
    }),
);

export const fileTable = pgTable("FILE",
    {
        id: serial("id").primaryKey(),
        contentType: varchar("content_type", { enum: ["Solution", "Question", "Q&S"] }).notNull(),
        examType: varchar("exam_type", { enum: ["Quiz", "Midterm", "Final"] }).notNull(),
        status: varchar("status", { enum: ["Public", "Private"] }).notNull(),
        downloadURL: varchar("downloadURL"),
        courseId: integer("course_id")
            .notNull()
            .references(() => courseTable.id, { onDelete: "cascade" }),

        userId: integer("user_id")
            .notNull()
            .references(() => userTable.id, { onDelete: "cascade" }),
    },
);
