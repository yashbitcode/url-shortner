const { varchar, text } = require("drizzle-orm/pg-core");
const { PgTable } = require("drizzle-orm/pg-core");
const { userTable } = require("./user.model");

const urlTable = PgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    code: varchar({ length: 50 }).unique().notNull(),
    targetUrl: text("targte_url").notNull(),
    userId: uuid("user_id")
        .reference(() => userTable.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

module.exports = {
    urlTable
};