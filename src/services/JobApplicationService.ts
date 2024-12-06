import {doc, getFirestore, setDoc, deleteDoc, updateDoc} from "firebase/firestore";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../data/applicationData";
import { addDoc, collection, getDocs } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {ResumeInfo} from "../models/ResumeInfo";
import {JobApplicationsResponse} from "../models/JobApplicationsResponse";
import {SavedResumesResponse} from "../models/SavedResumesResponse";

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

    async getAllJobApplications(): Promise<JobApplicationsResponse[]> {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User is not authenticated.");
        }

        const userJobApplicationsRef = collection(db, `jobApplications/${user.uid}/applications`);

        try {
            const querySnapshot = await getDocs(userJobApplicationsRef);

            const jobApplications: JobApplicationsResponse[] = querySnapshot.docs.map((doc) => ({
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

    async saveResume(uid: string, resumeData?: ResumeInfo): Promise<void> {
        const db = getFirestore();

        if (!uid) {
            throw new Error("User ID (uid) is required.");
        }

        if (!resumeData) {
            throw new Error("Resume data is required.");
        }

        try {
            // Reference to the sub-collection for job applications under the user's document
            const userResumeDataRef = collection(db, `resumes/${uid}/data`);

            // Add a new document with auto-generated ID in the user's sub-collection
            const docRef = await addDoc(userResumeDataRef, resumeData);

            console.log(
                `Resume data for user ${uid} has been saved successfully with ID: ${docRef.id}`
            );
        } catch (error) {
            console.error("Error saving resume data:", error);
            throw new Error("Failed to save resume data.");
        }
    }

    async getAllSavedResumes(): Promise<SavedResumesResponse[]> {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User is not authenticated.");
        }

        const userSavedResumesRef = collection(db, `resumes/${user.uid}/data`);

        try {
            const querySnapshot = await getDocs(userSavedResumesRef);

            const savedResumes: SavedResumesResponse[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data() as ResumeInfo,
            }));

            console.log("Resumes fetched successfully:", savedResumes);
            return savedResumes;
        } catch (error) {
            console.error("Error fetching resumes:", error);
            throw new Error("Failed to fetch resumes.");
        }
    }

    async deleteResume(uid: string, resumeId: string): Promise<void> {
        const db = getFirestore();

        if (!uid) {
            throw new Error("User ID (uid) is required.");
        }

        if (!resumeId) {
            throw new Error("Resume ID is required.");
        }

        try {
            // Reference to the specific document in the user's resumes sub-collection
            const resumeDocRef = doc(db, `resumes/${uid}/data/${resumeId}`);

            // Delete the document
            await deleteDoc(resumeDocRef);

            console.log(`Resume with ID ${resumeId} for user ${uid} has been deleted successfully.`);
        } catch (error) {
            console.error("Error deleting resume data:", error);
            throw new Error("Failed to delete resume data.");
        }
    }

    async editResume(uid: string, resumeId: string, updatedData: ResumeInfo): Promise<void> {
        const db = getFirestore();

        if (!uid) {
            throw new Error("User ID (uid) is required.");
        }

        if (!resumeId) {
            throw new Error("Resume ID is required.");
        }

        if (!updatedData) {
            throw new Error("Updated resume data is required.");
        }

        try {
            // Reference to the specific document in the user's resumes sub-collection
            const resumeDocRef = doc(db, `resumes/${uid}/data/${resumeId}`);

            // Replace the entire document with the new data
            await setDoc(resumeDocRef, updatedData);

            console.log(`Resume with ID ${resumeId} for user ${uid} has been updated successfully.`);
        } catch (error) {
            console.error("Error updating resume data:", error);
            throw new Error("Failed to update resume data.");
        }
    }



}

export default new JobApplicationService();
