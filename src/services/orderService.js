// Firebase Order Service
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, query, orderBy, setDoc } from 'firebase/firestore';

export const orderService = {
    getAllOrders: async () => {
        try {
            const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error getting orders: ", error);
            return [];
        }
    },

    createOrder: async (orderData) => {
        try {
            const timestamp = new Date();
            // Format: ORD-DYYYYMMDDHHMMSS
            const dateStr = timestamp.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
            const customId = `ORD-D${dateStr}`;

            const newOrder = {
                ...orderData,
                id: customId, // Explicitly save ID in data
                date: timestamp.toISOString().split('T')[0],
                status: 'Pending',
                createdAt: timestamp.toISOString()
            };

            // Use setDoc to define the document ID
            await setDoc(doc(db, 'orders', customId), newOrder);
            return newOrder;
        } catch (error) {
            console.error("Error creating order: ", error);
            throw error;
        }
    },

    updateOrderStatus: async (id, status, reason = null) => {
        try {
            const orderRef = doc(db, 'orders', id);
            const updates = { status };
            if (reason) {
                updates.cancellationReason = reason;
            }
            await updateDoc(orderRef, updates);
            return { id, ...updates };
        } catch (error) {
            console.error("Error updating order status: ", error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const docRef = doc(db, 'orders', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting order: ", error);
            throw error;
        }
    }
};
