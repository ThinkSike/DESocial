import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const communityTypeEnum = pgEnum("community_type", [
  "academic", "sports", "cultural", "technical", "social", "hobby",
]);

export const memberRoleEnum = pgEnum("member_role", [
  "member", "moderator", "admin",
]);

/** Who can see this user account / role on the platform */
export const userRoleEnum = pgEnum("user_role", [
  "student", "teacher", "alumni", "fresher", "admin",
]);

/** Who can see a post */
export const postVisibilityEnum = pgEnum("post_visibility", [
  "public",     // visible to all logged-in users
  "followers",  // visible only to followers of the author
  "community",  // visible only to members of the post's community
]);

/** Report target type */
export const reportTargetEnum = pgEnum("report_target", ["post", "comment"]);

/** Report status */
export const reportStatusEnum = pgEnum("report_status", [
  "pending", "reviewed", "dismissed",
]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  prn: text("prn").unique(),
  department: text("department"),
  verified: boolean("verified").default(false),
  /** Platform role */
  role: userRoleEnum("role").default("student").notNull(),
  /** Admin can deactivate an account without deleting it */
  isActive: boolean("is_active").default(true).notNull(),
  /** Forces the user to change their password on next login */
  mustChangePassword: boolean("must_change_password").default(false).notNull(),
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
  visibility: postVisibilityEnum("visibility").default("public").notNull(),
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
  parentId: integer("parent_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  images: text("images").array(),
  likesCount: integer("likes_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentLikes = pgTable(
  "comment_likes",
  {
    id: serial("id").primaryKey(),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueCommentLike: uniqueIndex("unique_comment_like").on(
      table.commentId,
      table.userId,
    ),
  }),
);

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

/** Reports submitted by users against posts or comments */
export const reports = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: reportTargetEnum("target_type").notNull(),
    targetId: integer("target_id").notNull(),
    reason: text("reason").notNull(), // "spam" | "harassment" | "inappropriate" | "misinformation" | "other"
    description: text("description"),
    status: reportStatusEnum("status").default("pending").notNull(),
    reviewedBy: text("reviewed_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // One report per user per target
    uniqueReport: uniqueIndex("unique_report").on(
      table.reporterId,
      table.targetType,
      table.targetId,
    ),
    targetIdx: index("reports_target_idx").on(table.targetType, table.targetId),
  }),
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  commentLikes: many(commentLikes),
  communityMembers: many(communityMembers),
  followers: many(follows, { relationName: "followers" }),
  following: many(follows, { relationName: "following" }),
  reports: many(reports, { relationName: "submittedReports" }),
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

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, { fields: [comments.parentId], references: [comments.id] }),
  replies: many(comments),
  commentLikes: many(commentLikes),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  user: one(users, { fields: [commentLikes.userId], references: [users.id] }),
}));

export const communitiesRelations = relations(communities, ({ many }) => ({
  members: many(communityMembers),
  posts: many(posts),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, {
    fields: [reports.reporterId],
    references: [users.id],
    relationName: "submittedReports",
  }),
  reviewer: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id],
  }),
}));
