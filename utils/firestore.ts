import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryConstraint,
  addDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Post, User } from "@/types/post";
import type { UserProfile } from "@/types/profile";
import type { Community } from "@/types/community";

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  POSTS: "posts",
  COMMUNITIES: "communities",
  COMMENTS: "comments",
  LIKES: "likes",
  FOLLOWS: "follows",
} as const;

// ===== USER OPERATIONS =====

export const createUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>,
) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userRef, {
    ...profileData,
    id: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>,
) => {
  const userRef = doc(db, COLLECTIONS.USERS, userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// ===== POST OPERATIONS =====

export const createPost = async (postData: Omit<Post, "id">) => {
  const postsRef = collection(db, COLLECTIONS.POSTS);
  const docRef = await addDoc(postsRef, {
    ...postData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    timestamp: serverTimestamp(),
  });
  return docRef.id;
};

export const getPost = async (postId: string): Promise<Post | null> => {
  const postRef = doc(db, COLLECTIONS.POSTS, postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const data = postSnap.data();
    return {
      ...data,
      id: postSnap.id,
      timestamp: data.timestamp?.toDate() || new Date(),
    } as Post;
  }
  return null;
};

export const getPosts = async (
  limitCount: number = 20,
  lastDoc?: DocumentSnapshot,
) => {
  const postsRef = collection(db, COLLECTIONS.POSTS);
  const constraints: QueryConstraint[] = [
    orderBy("timestamp", "desc"),
    limit(limitCount),
  ];

  if (lastDoc) {
    constraints.push(startAfter(lastDoc));
  }

  const q = query(postsRef, ...constraints);
  const querySnapshot = await getDocs(q);

  const posts = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp?.toDate() || new Date(),
    } as Post;
  });

  return {
    posts,
    lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
  };
};

export const getUserPosts = async (userId: string, limitCount: number = 20) => {
  const postsRef = collection(db, COLLECTIONS.POSTS);
  const q = query(
    postsRef,
    where("user.id", "==", userId),
    orderBy("timestamp", "desc"),
    limit(limitCount),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp?.toDate() || new Date(),
    } as Post;
  });
};

export const updatePost = async (postId: string, updates: Partial<Post>) => {
  const postRef = doc(db, COLLECTIONS.POSTS, postId);
  await updateDoc(postRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deletePost = async (postId: string) => {
  const postRef = doc(db, COLLECTIONS.POSTS, postId);
  await deleteDoc(postRef);
};

// ===== ENGAGEMENT OPERATIONS =====

export const likePost = async (postId: string, userId: string) => {
  const likeRef = doc(db, COLLECTIONS.LIKES, `${postId}_${userId}`);
  await setDoc(likeRef, {
    postId,
    userId,
    createdAt: serverTimestamp(),
  });

  // Increment like count
  const postRef = doc(db, COLLECTIONS.POSTS, postId);
  await updateDoc(postRef, {
    "engagement.likes": increment(1),
  });
};

export const unlikePost = async (postId: string, userId: string) => {
  const likeRef = doc(db, COLLECTIONS.LIKES, `${postId}_${userId}`);
  await deleteDoc(likeRef);

  // Decrement like count
  const postRef = doc(db, COLLECTIONS.POSTS, postId);
  await updateDoc(postRef, {
    "engagement.likes": increment(-1),
  });
};

export const isPostLiked = async (
  postId: string,
  userId: string,
): Promise<boolean> => {
  const likeRef = doc(db, COLLECTIONS.LIKES, `${postId}_${userId}`);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
};

// ===== COMMUNITY OPERATIONS =====

export const createCommunity = async (communityData: Omit<Community, "id">) => {
  const communitiesRef = collection(db, COLLECTIONS.COMMUNITIES);
  const docRef = await addDoc(communitiesRef, {
    ...communityData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getCommunity = async (
  communityId: string,
): Promise<Community | null> => {
  const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId);
  const communitySnap = await getDoc(communityRef);

  if (communitySnap.exists()) {
    return { ...communitySnap.data(), id: communitySnap.id } as Community;
  }
  return null;
};

export const getCommunities = async (limitCount: number = 20) => {
  const communitiesRef = collection(db, COLLECTIONS.COMMUNITIES);
  const q = query(
    communitiesRef,
    orderBy("memberCount", "desc"),
    limit(limitCount),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Community[];
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId);
  await updateDoc(communityRef, {
    memberCount: increment(1),
  });

  // You might want to create a separate collection for community members
  const memberRef = doc(
    db,
    `${COLLECTIONS.COMMUNITIES}/${communityId}/members`,
    userId,
  );
  await setDoc(memberRef, {
    userId,
    joinedAt: serverTimestamp(),
  });
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const communityRef = doc(db, COLLECTIONS.COMMUNITIES, communityId);
  await updateDoc(communityRef, {
    memberCount: increment(-1),
  });

  const memberRef = doc(
    db,
    `${COLLECTIONS.COMMUNITIES}/${communityId}/members`,
    userId,
  );
  await deleteDoc(memberRef);
};
