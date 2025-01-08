import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Feedback } from '@/app/types';

export async function getFeedback() {
  const querySnapshot = await getDocs(collection(db, 'feedback'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feedback[];
}

export async function addFeedback(feedback: Omit<Feedback, 'id'>) {
  const docRef = await addDoc(collection(db, 'feedback'), feedback);
  return docRef.id;
}

