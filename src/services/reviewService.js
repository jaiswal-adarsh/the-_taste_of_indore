import { db } from '../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

export const reviewService = {
    getAllReviews: async () => {
        try {
            // In a real app, you might filter by 'approved' status
            const q = query(collection(db, 'reviews'), orderBy('date', 'desc'), limit(6));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting reviews: ", error);
            return [];
        }
    },

    addReview: async (reviewData) => {
        try {
            const docRef = await addDoc(collection(db, 'reviews'), {
                ...reviewData,
                date: new Date().toISOString(),
                status: 'pending' // Optional: for moderation
            });
            return { id: docRef.id, ...reviewData };
        } catch (error) {
            console.error("Error adding review: ", error);
            throw error;
        }
    }
};
