const { varchar, text } = require("drizzle-orm/pg-core");
const { userTable } = require("./user.model");
const { uuid } = require("drizzle-orm/pg-core");
const { timestamp } = require("drizzle-orm/pg-core");
const { pgTable } = require("drizzle-orm/pg-core");

const urlTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    code: varchar({ length: 50 }).unique().notNull(),
    targetUrl: text("target_url").notNull(),
    userId: uuid("user_id")
        .references(() => userTable.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

module.exports = {
    urlTable
};