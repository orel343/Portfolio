import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Project } from '@/app/types';

export async function getProjects() {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
      technologies: data.technologies || [],
    };
  }) as Project[];
}

export async function addProject(project: Omit<Project, 'id'>) {
  const docRef = await addDoc(collection(db, 'projects'), project);
  return docRef.id;
}

export async function likeProject(projectId: string) {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    likes: increment(1),
  });
  const projectDoc = await getDocs(collection(db, 'projects'));
  return projectDoc.docs.find((doc) => doc.id === projectId)?.data().likes;
}

export async function incrementProjectViews(projectId: string) {
  const projectRef = doc(db, 'projects', projectId);
  await updateDoc(projectRef, {
    views: increment(1),
  });
  const projectDoc = await getDocs(collection(db, 'projects'));
  return projectDoc.docs.find((doc) => doc.id === projectId)?.data().views;
}

export async function getProject(id: string): Promise<Project | null> {
  const docRef = doc(db, 'projects', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
      startDate: data.startDate instanceof Timestamp ? data.startDate.toMillis() : (data.startDate || null),
      endDate: data.endDate instanceof Timestamp ? data.endDate.toMillis() : (data.endDate || null),
      technologies: data.technologies || [],
      features: data.features || [],
    } as Project;
  } else {
    return null;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const projectRef = doc(db, 'projects', id);
  await deleteDoc(projectRef);
}

