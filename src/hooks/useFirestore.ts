import { useState } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  serverTimestamp, 
  QueryConstraint,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../services/firebase';

interface FirestoreOperationState {
  loading: boolean;
  error: Error | null;
}

export const useFirestore = <T extends DocumentData>(collectionName: string) => {
  const [state, setState] = useState<FirestoreOperationState>({
    loading: false,
    error: null
  });

  // Agregar un documento
  const addDocument = async (data: Omit<T, 'id'>) => {
    setState({ loading: true, error: null });
    
    try {
      const collectionRef = collection(db, collectionName);
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collectionRef, docData);
      setState({ loading: false, error: null });
      
      return { id: docRef.id, ...docData };
    } catch (err) {
      console.error(`Error al agregar documento a ${collectionName}:`, err);
      const error = err instanceof Error ? err : new Error(`Error al agregar documento a ${collectionName}`);
      setState({ loading: false, error });
      throw error;
    }
  };

  // Actualizar un documento
  const updateDocument = async (id: string, data: Partial<T>) => {
    setState({ loading: true, error: null });
    
    try {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      setState({ loading: false, error: null });
      
      return true;
    } catch (err) {
      console.error(`Error al actualizar documento en ${collectionName}:`, err);
      const error = err instanceof Error ? err : new Error(`Error al actualizar documento en ${collectionName}`);
      setState({ loading: false, error });
      throw error;
    }
  };

  // Eliminar un documento
  const deleteDocument = async (id: string) => {
    setState({ loading: true, error: null });
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setState({ loading: false, error: null });
      
      return true;
    } catch (err) {
      console.error(`Error al eliminar documento de ${collectionName}:`, err);
      const error = err instanceof Error ? err : new Error(`Error al eliminar documento de ${collectionName}`);
      setState({ loading: false, error });
      throw error;
    }
  };

  // Obtener un documento por ID
  const getDocument = async (id: string) => {
    setState({ loading: true, error: null });
    
    try {
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
      
      setState({ loading: false, error: null });
      
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as unknown as T;
      } else {
        return null;
      }
    } catch (err) {
      console.error(`Error al obtener documento de ${collectionName}:`, err);
      const error = err instanceof Error ? err : new Error(`Error al obtener documento de ${collectionName}`);
      setState({ loading: false, error });
      throw error;
    }
  };

  // Consultar documentos con filtros
  const queryDocuments = async (...queryConstraints: QueryConstraint[]) => {
    setState({ loading: true, error: null });
    
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as T[];
      
      setState({ loading: false, error: null });
      
      return results;
    } catch (err) {
      console.error(`Error al consultar documentos de ${collectionName}:`, err);
      const error = err instanceof Error ? err : new Error(`Error al consultar documentos de ${collectionName}`);
      setState({ loading: false, error });
      throw error;
    }
  };

  return {
    loading: state.loading,
    error: state.error,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocument,
    queryDocuments
  };
}; 