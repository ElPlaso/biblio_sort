import { doc, collection, addDoc, deleteDoc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";
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

export const getProjectTitle = async (projectId: string) => {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        return projectData.title as string;
    }

    return "" as string;
}

export const deleteProject = async (projectId: string) => {
    const projectRef = doc(db, "projects", projectId);

    try {
        await deleteDoc(projectRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
};
export { db };

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

export const getProjectItems = async (projectId: string) => {
    const docRef = doc(db, "projects", projectId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const projectData = docSnap.data();
        return projectData.items as string[];
    }

    return [] as string[];
}

export const getProjects = async (userId: string) => {
    const projectsRef = collection(db, "projects");
    const querySnapshot = await getDocs(query(projectsRef, where("userId", "==", userId)));
    const projects: any[] = [];

    querySnapshot.forEach((doc) => {
        projects.push({
            id: doc.id,
            ...doc.data()
        });
    });

    return projects;
}