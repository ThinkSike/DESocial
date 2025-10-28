import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/config/firebase";

// Storage paths
export const STORAGE_PATHS = {
  AVATARS: "avatars",
  POST_IMAGES: "posts",
  COMMUNITY_COVERS: "communities/covers",
  COMMUNITY_ICONS: "communities/icons",
} as const;

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

/**
 * Upload an image to Firebase Storage
 * @param file - File or Blob to upload
 * @param path - Storage path (e.g., 'avatars/userId')
 * @param onProgress - Optional callback for upload progress
 * @returns Download URL of the uploaded file
 */
export const uploadImage = async (
  file: Blob | File,
  path: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const storageRef = ref(storage, path);

  if (onProgress) {
    // Use resumable upload with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          };
          onProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        },
      );
    });
  } else {
    // Simple upload without progress tracking
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (
  file: Blob | File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}_${Date.now()}`;
  return uploadImage(file, path, onProgress);
};

/**
 * Upload post image
 */
export const uploadPostImage = async (
  file: Blob | File,
  postId: string,
  imageIndex: number,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.POST_IMAGES}/${postId}_${imageIndex}_${Date.now()}`;
  return uploadImage(file, path, onProgress);
};

/**
 * Upload community cover image
 */
export const uploadCommunityCover = async (
  file: Blob | File,
  communityId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_COVERS}/${communityId}_${Date.now()}`;
  return uploadImage(file, path, onProgress);
};

/**
 * Upload community icon
 */
export const uploadCommunityIcon = async (
  file: Blob | File,
  communityId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_ICONS}/${communityId}_${Date.now()}`;
  return uploadImage(file, path, onProgress);
};

/**
 * Delete an image from Storage
 * @param url - Download URL of the image to delete
 */
export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

/**
 * Get download URL for a file
 * @param path - Storage path
 */
export const getImageURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};
