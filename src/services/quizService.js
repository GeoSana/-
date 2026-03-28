import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const COLLECTION = 'community_quizzes';

/**
 * Saves a quiz to Firestore so ALL users can see it.
 */
export const saveCommunityQuiz = async (quiz, authorName = 'Аноним') => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION), {
      ...quiz,
      authorName,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.error('Error saving community quiz:', e);
    throw e;
  }
};

/**
 * Loads all community quizzes from Firestore (newest first).
 */
export const loadCommunityQuizzes = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      firestoreId: doc.id,
      // Ensure category is set for filter
      category: doc.data().category || 'community',
    }));
  } catch (e) {
    console.error('Error loading community quizzes:', e);
    return [];
  }
};

/**
 * Gets a single quiz by Firestore document ID.
 */
export const getQuizById = async (firestoreId) => {
  try {
    const docRef = doc(db, COLLECTION, firestoreId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...snap.data(), firestoreId: snap.id };
    }
    return null;
  } catch (e) {
    console.error('Error fetching quiz by id:', e);
    return null;
  }
};
