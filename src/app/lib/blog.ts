import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';
import type { BlogPost } from '@/app/types';

export async function getBlogPosts() {
  const querySnapshot = await getDocs(collection(db, 'blog'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BlogPost[];
}

export async function addBlogPost(post: Omit<BlogPost, 'id'>) {
  const docRef = await addDoc(collection(db, 'blog'), post);
  return docRef.id;
}

export async function likeBlogPost(postId: string) {
  const postRef = doc(db, 'blog', postId);
  await updateDoc(postRef, {
    likes: increment(1),
  });
  const postDoc = await getDocs(collection(db, 'blog'));
  return postDoc.docs.find((doc) => doc.id === postId)?.data().likes;
}

export async function incrementBlogViews(postId: string) {
  const postRef = doc(db, 'blog', postId);
  await updateDoc(postRef, {
    views: increment(1),
  });
  const postDoc = await getDocs(collection(db, 'blog'));
  return postDoc.docs.find((doc) => doc.id === postId)?.data().views;
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, 'blog', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  } else {
    return null;
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  const blogPostRef = doc(db, 'blog', id);
  await deleteDoc(blogPostRef);
}

