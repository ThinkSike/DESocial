import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, auth } from "@/config/firebase";
import { Platform } from "react-native";

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
 * Get MIME type from file URI
 */
const getMimeTypeFromUri = (uri: string): string => {
  const extension = uri.toLowerCase().split(".").pop();

  switch (extension) {
    case "heic":
    case "heif":
      return "image/jpeg";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
};

/**
 * Convert a file URI to Base64 string
 */
const uriToBase64 = async (uri: string): Promise<string> => {
  console.log(`[uriToBase64] Converting URI`);

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log(`[uriToBase64] Blob size: ${blob.size}`);

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("FileReader failed"));
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] ?? "";
        console.log(`[uriToBase64] Conversion complete`);
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error: any) {
    console.error("[uriToBase64] Error:", error.message);
    throw error;
  }
};

/**
 * Upload directly to Firebase Storage using token authentication
 * This bypasses service account requirements
 */
const uploadWithToken = async (
  base64Data: string,
  path: string,
  contentType: string,
): Promise<string> => {
  console.log(`[uploadWithToken] Starting upload to: ${path}`);

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    // Get fresh auth token
    const token = await currentUser.getIdToken(true);
    console.log("[uploadWithToken] Got auth token");

    const bucketName = storage.app.options.storageBucket;

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    console.log(`[uploadWithToken] Binary size: ${bytes.length} bytes`);

    // Use Firebase Storage upload API with token
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?uploadType=media&name=${encodeURIComponent(path)}`;

    console.log("[uploadWithToken] Uploading...");

    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
      body: bytes,
    });

    console.log(`[uploadWithToken] Response status: ${uploadResponse.status}`);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("[uploadWithToken] Error:", errorText);
      throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
    }

    // Get download URL
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("[uploadWithToken] Success!");

    return downloadURL;
  } catch (error: any) {
    console.error("[uploadWithToken] Error:", error.message);
    throw error;
  }
};

/**
 * Upload an image to Firebase Storage
 */
export const uploadImage = async (
  fileOrUri: Blob | File | string,
  path: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  console.log("\n========== UPLOAD START ==========");
  console.log(`Platform: ${Platform.OS}`);

  try {
    let base64String: string;
    let mimeType: string;

    // Convert to base64
    if (typeof fileOrUri === "string") {
      mimeType = getMimeTypeFromUri(fileOrUri);
      base64String = await uriToBase64(fileOrUri);
    } else if (fileOrUri instanceof File) {
      mimeType = fileOrUri.type || "image/jpeg";
      base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("FileReader failed"));
        reader.onloadend = () =>
          resolve((reader.result as string).split(",")[1] ?? "");
        reader.readAsDataURL(fileOrUri);
      });
    } else {
      mimeType = fileOrUri.type || "image/jpeg";
      base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("FileReader failed"));
        reader.onloadend = () =>
          resolve((reader.result as string).split(",")[1] ?? "");
        reader.readAsDataURL(fileOrUri);
      });
    }

    // Upload using token authentication
    const downloadURL = await uploadWithToken(base64String, path, mimeType);
    console.log("========== UPLOAD SUCCESS ==========\n");
    return downloadURL;
  } catch (error: any) {
    console.error("\n========== UPLOAD ERROR ==========");
    console.error("Error:", error.message);
    console.error("=====================================\n");
    throw error;
  }
};

/**
 * Upload avatar image
 */
export const uploadAvatar = async (
  fileOrUri: Blob | File | string,
  userId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.AVATARS}/${userId}_${Date.now()}.jpg`;
  return uploadImage(fileOrUri, path, onProgress);
};

/**
 * Upload post image
 */
export const uploadPostImage = async (
  fileOrUri: Blob | File | string,
  postId: string,
  imageIndex: number,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.POST_IMAGES}/${postId}_${imageIndex}_${Date.now()}.jpg`;
  return uploadImage(fileOrUri, path, onProgress);
};

/**
 * Upload community cover image
 */
export const uploadCommunityCover = async (
  fileOrUri: Blob | File | string,
  communityId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_COVERS}/${communityId}_${Date.now()}.jpg`;
  return uploadImage(fileOrUri, path, onProgress);
};

/**
 * Upload community icon
 */
export const uploadCommunityIcon = async (
  fileOrUri: Blob | File | string,
  communityId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> => {
  const path = `${STORAGE_PATHS.COMMUNITY_ICONS}/${communityId}_${Date.now()}.jpg`;
  return uploadImage(fileOrUri, path, onProgress);
};

/**
 * Delete an image from Storage
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
 */
export const getImageURL = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};
