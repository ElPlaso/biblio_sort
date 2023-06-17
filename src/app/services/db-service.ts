import { doc, collection, addDoc, deleteDoc, updateDoc, getDocs, query, where, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Project from "../types/project";

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

export const getProjects = async (userId: string) => {
    const projects: Project[] = [];

    const q = query(collection(db, "projects"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        const projectData = doc.data();
        projects.push({
            id: doc.id,
            title: projectData.title,
            items: projectData.items,
        });
    });

    return projects;
};

// checks if project exists and belongs to current user
export const projectExists = async (projectId: string, uid: string) => {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        if (projectData.userId === uid) {
            return true;
        }
    }

    return false;
}

