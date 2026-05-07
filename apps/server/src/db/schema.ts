import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  serial,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const communityTypeEnum = pgEnum("community_type", [
  "academic",
  "sports",
  "cultural",
  "technical",
  "social",
  "hobby",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "member",
  "moderator",
  "admin",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  prn: text("prn"),
  department: text("department"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  text: text("text"),
  images: text("images").array(),
  hashtags: text("hashtags").array(),
  communityId: integer("community_id").references(() => communities.id, {
    onDelete: "set null",
  }),
  likesCount: integer("likes_count").default(0).notNull(),
  commentsCount: integer("comments_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: communityTypeEnum("type").notNull(),
  memberCount: integer("member_count").default(0).notNull(),
  coverImage: text("cover_image"),
  icon: text("icon"),
  isVerified: boolean("is_verified").default(false),
  location: text("location"),
  tags: text("tags").array().default([]),
  trending: boolean("trending").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const communityMembers = pgTable(
  "community_members",
  {
    id: serial("id").primaryKey(),
    communityId: integer("community_id")
      .notNull()
      .references(() => communities.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").default("member").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueMembership: uniqueIndex("unique_membership").on(
      table.communityId,
      table.userId,
    ),
  }),
);

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueLike: uniqueIndex("unique_like").on(table.postId, table.userId),
  }),
);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const follows = pgTable(
  "follows",
  {
    id: serial("id").primaryKey(),
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueFollow: uniqueIndex("unique_follow").on(
      table.followerId,
      table.followingId,
    ),
  }),
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  communityMembers: many(communityMembers),
  followers: many(follows, { relationName: "followers" }),
  following: many(follows, { relationName: "following" }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  community: one(communities, {
    fields: [posts.communityId],
    references: [communities.id],
  }),
  likes: many(likes),
  comments: many(comments),
}));

export const communitiesRelations = relations(communities, ({ many }) => ({
  members: many(communityMembers),
  posts: many(posts),
}));
