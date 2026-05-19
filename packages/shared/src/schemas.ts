import { z } from "zod";

export const LoginSchema = z.object({
  prn: z.string().regex(/^\d{10}$/, "PRN must be 10 digits"),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  prn: z.string().regex(/^\d{10}$/, "PRN must be 10 digits"),
  password: z.string().min(6),
  username: z.string().min(2).max(30),
  displayName: z.string().min(1).max(50),
});

export const PostContentSchema = z.object({
  text: z.string().optional(),
  images: z.array(z.string()).optional(),
  hashtags: z.array(z.string()).optional(),
});

export const CreatePostSchema = z.object({
  content: PostContentSchema,
  communityId: z.string().optional(),
});

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  username: z.string().min(2).max(30).optional(),
  bio: z.string().max(500).optional(),
  department: z.string().optional(),
  prn: z.string().optional(),
});

export const CommunitySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  category: z.string(),
  type: z.enum([
    "academic",
    "sports",
    "cultural",
    "technical",
    "social",
    "hobby",
  ]),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type CreateCommunityInput = z.infer<typeof CommunitySchema>;
