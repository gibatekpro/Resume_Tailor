import {doc, getFirestore, setDoc} from "firebase/firestore";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../data/applicationData";
import { addDoc, collection, getDocs } from "firebase/firestore";
import {getAuth} from "firebase/auth";

class JobApplicationService {
    /**
     * Fetch all job applications from the `jobApplications` collection.
     * @returns A promise with an array of job applications.
     * Save a job application to Firestore.
     * @param uid - The user's unique ID.
     * @param jobApplication - The job application data.
     * @returns A promise indicating the save operation's success or failure.
     */

    async saveJobApplication(uid: string, jobApplication?: JobApplicationInfo): Promise<void> {
        const db = getFirestore();

        if (!uid) {
            throw new Error("User ID (uid) is required.");
        }

        if (!jobApplication) {
            throw new Error("Job application data is required.");
        }

        try {
            // Reference to the sub-collection for job applications under the user's document
            const userJobApplicationsRef = collection(db, `jobApplications/${uid}/applications`);

            // Add a new document with auto-generated ID in the user's sub-collection
            const docRef = await addDoc(userJobApplicationsRef, jobApplication);

            console.log(
                `Job application for user ${uid} has been saved successfully with ID: ${docRef.id}`
            );
        } catch (error) {
            console.error("Error saving job application:", error);
            throw new Error("Failed to save job application.");
        }
    }

    async getAllJobApplications(): Promise<{ id: string; data: JobApplicationInfo }[]> {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User is not authenticated.");
        }

        const userJobApplicationsRef = collection(db, `jobApplications/${user.uid}/applications`);

        try {
            const querySnapshot = await getDocs(userJobApplicationsRef);

            const jobApplications = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data() as JobApplicationInfo,
            }));

            console.log("Job applications fetched successfully:", jobApplications);
            return jobApplications;
        } catch (error) {
            console.error("Error fetching job applications:", error);
            throw new Error("Failed to fetch job applications.");
        }
    }

}

export default new JobApplicationService();
