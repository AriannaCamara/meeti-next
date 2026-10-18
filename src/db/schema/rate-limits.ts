import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const rateLimits = pgTable('rate_limits', {
    identifier: text('identifier').primaryKey(),
    windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
    count: integer('count').notNull().default(0)
})
