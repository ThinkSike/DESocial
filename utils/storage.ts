import { storage } from "@/config/firebase";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const STORAGE_PATHS = {
  AVATARS: "avatars",
  POST_IMAGES: "posts",
  COMMUNITY_COVERS: "communities/covers",
  COMMUNITY_ICONS: "communities/icons",
} as const;

// Compression settings - extremely aggressive for small viewing areas
const COMPRESSION_QUALITY = {
  AVATAR: 0.3,
  POST: 0.4,
  COMMUNITY: 0.4,
} as const;

// Max dimensions to reduce file size - much smaller for mobile viewing
const MAX_DIMENSIONS = {
  AVATAR: 300,
  POST: 800,
  COMMUNITY: 800,
} as const;

/**
 * Compress and resize image before upload
 */
const compressImage = async (
  uri: string,
  quality: number = 0.4,
  maxDimension: number = 800
): Promise<string> => {
  try {
    const context = ImageManipulator.manipulate(uri);

    // Resize image to reduce file size
    // This will maintain aspect ratio and ensure neither dimension exceeds maxDimension
    context.resize({ width: maxDimension });

    const image = await context.renderAsync();
    const result = await image.saveAsync({
      compress: quality,
      format: SaveFormat.JPEG,
    });
    return result.uri;
  } catch (error) {
    console.error("Compression error:", error);
    // Return original URI if compression fails
    return uri;
  }
};

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
  compressionQuality?: number,
  maxDimension?: number
): Promise<string> => {
  try {
    let file: Blob | File;

    if (typeof fileOrUri === "string") {
      // Compress if it's a URI and quality is specified
      const uri = compressionQuality
        ? await compressImage(fileOrUri, compressionQuality, maxDimension)
        : fileOrUri;
      file = await uriToBlob(uri);
    } else {
      file = fileOrUri;
    }

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
  userId: string
): Promise<string> => {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}_${Date.now()}.jpg`;
  return uploadImage(
    fileOrUri,
    path,
    COMPRESSION_QUALITY.AVATAR,
    MAX_DIMENSIONS.AVATAR
  );
};

/**
 * Upload post image
 */
export const uploadPostImage = async (
  fileOrUri: Blob | File | string,
  postId: string,
  imageIndex: number
): Promise<string> => {
  const path = `${STORAGE_PATHS.POST_IMAGES}/${postId}_${imageIndex}.jpg`;
  return uploadImage(
    fileOrUri,
    path,
    COMPRESSION_QUALITY.POST,
    MAX_DIMENSIONS.POST
  );
};

/**
 * Upload community cover
 */
export const uploadCommunityCover = async (
  fileOrUri: Blob | File | string,
  communityId: string
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_COVERS}/${communityId}.jpg`;
  return uploadImage(
    fileOrUri,
    path,
    COMPRESSION_QUALITY.COMMUNITY,
    MAX_DIMENSIONS.COMMUNITY
  );
};

/**
 * Upload community icon
 */
export const uploadCommunityIcon = async (
  fileOrUri: Blob | File | string,
  communityId: string
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_ICONS}/${communityId}.jpg`;
  return uploadImage(
    fileOrUri,
    path,
    COMPRESSION_QUALITY.COMMUNITY,
    MAX_DIMENSIONS.COMMUNITY
  );
};

/**
 * Delete image
 */
export const deleteImage = async (url: string): Promise<void> => {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
};
