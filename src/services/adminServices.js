import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';

// Categories
export const categoryService = {
    getAll: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting categories: ", error);
            return [];
        }
    },
    add: async (category) => {
        try {
            const docRef = await addDoc(collection(db, 'categories'), category);
            return { id: docRef.id, ...category };
        } catch (error) {
            console.error("Error adding category: ", error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            await deleteDoc(doc(db, 'categories', id));
        } catch (error) {
            console.error("Error deleting category: ", error);
            throw error;
        }
    }
};

// Banners
export const bannerService = {
    getAll: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'banners'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting banners: ", error);
            return [];
        }
    },
    add: async (banner) => {
        try {
            const docRef = await addDoc(collection(db, 'banners'), banner);
            return { id: docRef.id, ...banner };
        } catch (error) {
            console.error("Error adding banner: ", error);
            throw error;
        }
    },
    delete: async (id) => {
        try {
            await deleteDoc(doc(db, 'banners', id));
        } catch (error) {
            console.error("Error deleting banner: ", error);
            throw error;
        }
    }
};

// Content (About Us)
export const contentService = {
    getAbout: async () => {
        try {
            const docRef = doc(db, 'content', 'about');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().text;
            } else {
                return '';
            }
        } catch (error) {
            console.error("Error getting about content: ", error);
            return '';
        }
    },
    updateAbout: async (text) => {
        try {
            await setDoc(doc(db, 'content', 'about'), { text });
            return text;
        } catch (error) {
            console.error("Error updating about content: ", error);
            throw error;
        }
    }
};
