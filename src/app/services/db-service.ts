import { doc, collection, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

// Database functions

export const createProject = async (userId: string, title: string, items: string[]) => {
    try {
        const docRef = await addDoc(collection(db, "projects"), {
            userId: userId,
            title: title,
            items: items
        });

        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export const updateProjectItems = async (projectId: string, items: string[]) => {
    const projectRef = doc(db, "projects", projectId);

    try {
        await updateDoc(projectRef, {
            items: items
        });
    } catch (e) {
        console.error("Error updating document: ", e);
    }
};

export const deleteProject = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);

    try {
        await deleteDoc(projectRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};
export { db };

