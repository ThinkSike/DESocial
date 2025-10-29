import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/config/firebase";

export const STORAGE_PATHS = {
  AVATARS: "avatars",
  POST_IMAGES: "posts",
  COMMUNITY_COVERS: "communities/covers",
  COMMUNITY_ICONS: "communities/icons",
} as const;

/**
 * Upload file to Firebase Storage
 */
const uploadFile = async (file: Blob | File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

/**
 * Convert URI to Blob
 */
const uriToBlob = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  return response.blob();
};

/**
 * Upload image from URI or File
 */
export const uploadImage = async (
  fileOrUri: Blob | File | string,
  path: string,
): Promise<string> => {
  try {
    const file =
      typeof fileOrUri === "string" ? await uriToBlob(fileOrUri) : fileOrUri;

    return await uploadFile(file, path);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (
  fileOrUri: Blob | File | string,
  userId: string,
): Promise<string> => {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}_${Date.now()}.jpg`;
  return uploadImage(fileOrUri, path);
};

/**
 * Upload post image
 */
export const uploadPostImage = async (
  fileOrUri: Blob | File | string,
  postId: string,
  imageIndex: number,
): Promise<string> => {
  const path = `${STORAGE_PATHS.POST_IMAGES}/${postId}_${imageIndex}.jpg`;
  return uploadImage(fileOrUri, path);
};

/**
 * Upload community cover
 */
export const uploadCommunityCover = async (
  fileOrUri: Blob | File | string,
  communityId: string,
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_COVERS}/${communityId}.jpg`;
  return uploadImage(fileOrUri, path);
};

/**
 * Upload community icon
 */
export const uploadCommunityIcon = async (
  fileOrUri: Blob | File | string,
  communityId: string,
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_ICONS}/${communityId}.jpg`;
  return uploadImage(fileOrUri, path);
};

/**
 * Delete image
 */
export const deleteImage = async (url: string): Promise<void> => {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
};
