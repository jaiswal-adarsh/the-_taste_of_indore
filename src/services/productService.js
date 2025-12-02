import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';

export const productService = {
    getAllProducts: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting products: ", error);
            return [];
        }
    },

    getProductById: async (id) => {
        try {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                throw new Error('Product not found');
            }
        } catch (error) {
            console.error("Error getting product: ", error);
            throw error;
        }
    },

    getProductsByCategory: async (category) => {
        try {
            const q = query(collection(db, 'products'), where('category', '==', category));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting products by category: ", error);
            return [];
        }
    },

    addProduct: async (productData) => {
        try {
            const docRef = await addDoc(collection(db, 'products'), productData);
            return { id: docRef.id, ...productData };
        } catch (error) {
            console.error("Error adding product: ", error);
            throw error;
        }
    },

    updateProduct: async (id, updates) => {
        try {
            const productRef = doc(db, 'products', id);
            await updateDoc(productRef, updates);
            return { id, ...updates };
        } catch (error) {
            console.error("Error updating product: ", error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (error) {
            console.error("Error deleting product: ", error);
            throw error;
        }
    }
};
