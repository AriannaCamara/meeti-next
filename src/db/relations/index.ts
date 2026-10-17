import { relations } from "drizzle-orm";
import * as schema from "../schema";

export const userRelations = relations(schema.users, ({ one, many }) => ({
  sessions: many(schema.sessions),
  accounts: many(schema.accounts),
  communities: many(schema.community),
  meetis: many(schema.meeti),
}));

export const sessionRelations = relations(schema.sessions, ({ one }) => ({
  user: one(schema.users, {
    fields: [schema.sessions.userId],
    references: [schema.users.id],
  }),
}));

export const accountRelations = relations(schema.accounts, ({ one }) => ({
  user: one(schema.users, {
    fields: [schema.accounts.userId],
    references: [schema.users.id],
  }),
}));

export const communityRelations = relations(schema.community, ({ one, many }) => ({
  createdBy: one(schema.users, {
    fields: [schema.community.createdBy],
    references: [schema.users.id],
  }),
  members: many(schema.communityMembers),
}));

export const communityMemberRelations = relations(schema.communityMembers, ({ one }) => ({
  community: one(schema.community, {
    fields: [schema.communityMembers.communityId],
    references: [schema.community.id],
  }),
  user: one(schema.users, {
    fields: [schema.communityMembers.userId],
    references: [schema.users.id],
  }),
}));

export const meetiRelations = relations(schema.meeti, ({ one }) => ({
  location: one(schema.meetiLocations, {
    fields: [schema.meeti.id],
    references: [schema.meetiLocations.meetiId],
  }),
  category: one(schema.category, {
    fields: [schema.meeti.categoryId],
    references: [schema.category.id],
  }),
  community: one(schema.community, {
    fields: [schema.meeti.communityId],
    references: [schema.community.id],
  }),
  admin: one(schema.users, {
    fields: [schema.meeti.createdBy],
    references: [schema.users.id],
  }),
}));

export const meetiAttendeesRelations = relations(schema.meetiAttendees, ({ one }) => ({
  user: one(schema.users, {
    fields: [schema.meetiAttendees.userId],
    references: [schema.users.id],
  }),
}));

export const meetiLocationsRelations = relations(schema.meetiLocations, ({ one }) => ({
  meeti: one(schema.meeti, {
    fields: [schema.meetiLocations.meetiId],
    references: [schema.meeti.id],
  }),
}));