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

// updates project title
export const updateProjectTitle = async (projectId: string, title: string) => {
    const projectRef = doc(db, "projects", projectId);
    try {
        await updateDoc(projectRef, {
            title: title
        });
    }
    catch (e) {
        console.error("Error updating document: ", e);
    }
}

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

// gets all items from a project with given id 
export const getProjectItems = async (projectId: string) => {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        return projectData.items as string[];
    }

    return [] as string[];
}

// gets title of project with given id
export const getProjectTitle = async (projectId: string) => {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        return projectData.title as string;
    }

    return "" as string;
}