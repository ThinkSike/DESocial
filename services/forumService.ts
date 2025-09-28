// Forum service for DESocial Q&A functionality
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CreateForumPostForm, ForumAnswer, ForumPost } from '../types';

class ForumService {
  private forumPostsCollection = collection(db, 'forumPosts');
  private forumAnswersCollection = collection(db, 'forumAnswers');
  private moderationQueue = collection(db, 'moderationQueue');

  // Create a new forum question
  async createQuestion(questionData: CreateForumPostForm, authorId: string, authorName: string): Promise<string> {
    try {
      const question: Omit<ForumPost, 'id'> = {
        authorId,
        authorName,
        title: questionData.title,
        content: questionData.content,
        courseTags: questionData.courseTags,
        upvotes: [],
        downvotes: [],
        answersCount: 0,
        isAnswered: false,
        isModerated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.forumPostsCollection, question);

      // Add to moderation queue if needed
      await this.addToModerationQueue(docRef.id, 'question', authorId);

      return docRef.id;
    } catch (error) {
      console.error('Create question error:', error);
      throw error;
    }
  }

  // Get forum questions with filters
  async getQuestions(
    courseTags?: string[],
    isAnswered?: boolean,
    limitCount: number = 20
  ): Promise<ForumPost[]> {
    try {
      let q = query(
        this.forumPostsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      // Add filters
      if (courseTags && courseTags.length > 0) {
        q = query(q, where('courseTags', 'array-contains-any', courseTags));
      }

      if (typeof isAnswered === 'boolean') {
        q = query(q, where('isAnswered', '==', isAnswered));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumPost[];
    } catch (error) {
      console.error('Get questions error:', error);
      throw error;
    }
  }

  // Get popular/trending questions (by upvotes)
  async getTrendingQuestions(limitCount: number = 10): Promise<ForumPost[]> {
    try {
      const querySnapshot = await getDocs(this.forumPostsCollection);
      const questions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumPost[];

      // Sort by score (upvotes - downvotes) and recent activity
      return questions
        .sort((a, b) => {
          const scoreA = a.upvotes.length - a.downvotes.length;
          const scoreB = b.upvotes.length - b.downvotes.length;
          if (scoreA !== scoreB) return scoreB - scoreA;
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        })
        .slice(0, limitCount);
    } catch (error) {
      console.error('Get trending questions error:', error);
      throw error;
    }
  }

  // Upvote/downvote a question
  async voteQuestion(questionId: string, userId: string, voteType: 'upvote' | 'downvote'): Promise<void> {
    try {
      const questionRef = doc(db, 'forumPosts', questionId);
      const questionDoc = await getDoc(questionRef);
      
      if (!questionDoc.exists()) {
        throw new Error('Question not found');
      }

      const question = questionDoc.data() as ForumPost;
      const hasUpvoted = question.upvotes.includes(userId);
      const hasDownvoted = question.downvotes.includes(userId);

      let updateData: any = {};

      if (voteType === 'upvote') {
        if (hasUpvoted) {
          // Remove upvote
          updateData.upvotes = arrayRemove(userId);
        } else {
          // Add upvote and remove downvote if exists
          updateData.upvotes = arrayUnion(userId);
          if (hasDownvoted) {
            updateData.downvotes = arrayRemove(userId);
          }
        }
      } else if (voteType === 'downvote') {
        if (hasDownvoted) {
          // Remove downvote
          updateData.downvotes = arrayRemove(userId);
        } else {
          // Add downvote and remove upvote if exists
          updateData.downvotes = arrayUnion(userId);
          if (hasUpvoted) {
            updateData.upvotes = arrayRemove(userId);
          }
        }
      }

      updateData.updatedAt = new Date();
      await updateDoc(questionRef, updateData);
    } catch (error) {
      console.error('Vote question error:', error);
      throw error;
    }
  }

  // Add an answer to a question
  async addAnswer(questionId: string, content: string, authorId: string, authorName: string): Promise<string> {
    try {
      const answer: Omit<ForumAnswer, 'id'> = {
        questionId,
        authorId,
        authorName,
        content,
        upvotes: [],
        downvotes: [],
        isBestAnswer: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.forumAnswersCollection, answer);

      // Increment answer count and update question timestamp
      await updateDoc(doc(db, 'forumPosts', questionId), {
        answersCount: increment(1),
        updatedAt: new Date(),
      });

      // Add to moderation queue
      await this.addToModerationQueue(docRef.id, 'answer', authorId);

      return docRef.id;
    } catch (error) {
      console.error('Add answer error:', error);
      throw error;
    }
  }

  // Get answers for a question
  async getAnswers(questionId: string): Promise<ForumAnswer[]> {
    try {
      const q = query(
        this.forumAnswersCollection,
        where('questionId', '==', questionId),
        orderBy('isBestAnswer', 'desc'),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumAnswer[];
    } catch (error) {
      console.error('Get answers error:', error);
      throw error;
    }
  }

  // Mark an answer as best answer (question author only)
  async markBestAnswer(questionId: string, answerId: string, authorId: string): Promise<void> {
    try {
      // Verify the user is the question author
      const questionDoc = await getDoc(doc(db, 'forumPosts', questionId));
      if (!questionDoc.exists()) {
        throw new Error('Question not found');
      }

      const question = questionDoc.data() as ForumPost;
      if (question.authorId !== authorId) {
        throw new Error('Only question author can mark best answer');
      }

      // Remove best answer status from previous best answer
      if (question.bestAnswerId) {
        await updateDoc(doc(db, 'forumAnswers', question.bestAnswerId), {
          isBestAnswer: false,
        });
      }

      // Mark new best answer
      await updateDoc(doc(db, 'forumAnswers', answerId), {
        isBestAnswer: true,
      });

      // Update question
      await updateDoc(doc(db, 'forumPosts', questionId), {
        bestAnswerId: answerId,
        isAnswered: true,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Mark best answer error:', error);
      throw error;
    }
  }

  // Vote on an answer
  async voteAnswer(answerId: string, userId: string, voteType: 'upvote' | 'downvote'): Promise<void> {
    try {
      const answerRef = doc(db, 'forumAnswers', answerId);
      const answerDoc = await getDoc(answerRef);
      
      if (!answerDoc.exists()) {
        throw new Error('Answer not found');
      }

      const answer = answerDoc.data() as ForumAnswer;
      const hasUpvoted = answer.upvotes.includes(userId);
      const hasDownvoted = answer.downvotes.includes(userId);

      let updateData: any = {};

      if (voteType === 'upvote') {
        if (hasUpvoted) {
          updateData.upvotes = arrayRemove(userId);
        } else {
          updateData.upvotes = arrayUnion(userId);
          if (hasDownvoted) {
            updateData.downvotes = arrayRemove(userId);
          }
        }
      } else if (voteType === 'downvote') {
        if (hasDownvoted) {
          updateData.downvotes = arrayRemove(userId);
        } else {
          updateData.downvotes = arrayUnion(userId);
          if (hasUpvoted) {
            updateData.upvotes = arrayRemove(userId);
          }
        }
      }

      updateData.updatedAt = new Date();
      await updateDoc(answerRef, updateData);
    } catch (error) {
      console.error('Vote answer error:', error);
      throw error;
    }
  }

  // Search questions
  async searchQuestions(searchTerm: string, courseTags?: string[]): Promise<ForumPost[]> {
    try {
      // Note: This is a basic implementation. For production, consider using
      // Algolia or Elasticsearch for better search capabilities
      const querySnapshot = await getDocs(this.forumPostsCollection);
      const questions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumPost[];

      return questions.filter(question => {
        const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            question.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTags = !courseTags || courseTags.length === 0 ||
                          question.courseTags.some(tag => courseTags.includes(tag));

        return matchesSearch && matchesTags;
      });
    } catch (error) {
      console.error('Search questions error:', error);
      throw error;
    }
  }

  // Get course tags (for auto-complete)
  async getCourseTags(): Promise<string[]> {
    try {
      const querySnapshot = await getDocs(this.forumPostsCollection);
      const allTags = new Set<string>();

      querySnapshot.docs.forEach(doc => {
        const question = doc.data() as ForumPost;
        question.courseTags.forEach(tag => allTags.add(tag));
      });

      return Array.from(allTags).sort();
    } catch (error) {
      console.error('Get course tags error:', error);
      throw error;
    }
  }

  // Add content to moderation queue
  private async addToModerationQueue(contentId: string, type: 'question' | 'answer', authorId: string): Promise<void> {
    try {
      const moderationItem = {
        contentId,
        type,
        authorId,
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(this.moderationQueue, moderationItem);
    } catch (error) {
      console.error('Add to moderation queue error:', error);
    }
  }

  // Get moderation queue items (admin only)
  async getModerationQueue(): Promise<any[]> {
    try {
      const q = query(
        this.moderationQueue,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Get moderation queue error:', error);
      throw error;
    }
  }

  // Approve or reject content (admin only)
  async moderateContent(moderationId: string, action: 'approve' | 'reject', adminId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'moderationQueue', moderationId), {
        status: action === 'approve' ? 'approved' : 'rejected',
        moderatedBy: adminId,
        moderatedAt: new Date(),
      });

      // If approved, mark the original content as moderated
      const moderationDoc = await getDoc(doc(db, 'moderationQueue', moderationId));
      if (moderationDoc.exists() && action === 'approve') {
        const moderation = moderationDoc.data();
        const collectionName = moderation.type === 'question' ? 'forumPosts' : 'forumAnswers';
        
        await updateDoc(doc(db, collectionName, moderation.contentId), {
          isModerated: true,
        });
      }
    } catch (error) {
      console.error('Moderate content error:', error);
      throw error;
    }
  }
}

export const forumService = new ForumService();