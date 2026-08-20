import {addDoc, doc, getFirestore, setDoc, deleteDoc, collection, getDocs, getDoc} from "firebase/firestore";
import {onAuthStateChanged, type User} from "firebase/auth";
import type {JobApplicationInfo} from "../models/JobApplicationInfo";
import type {ResumeInfo} from "../models/ResumeInfo";
import type {JobApplicationsResponse} from "../models/JobApplicationsResponse";
import type {SavedResumesResponse} from "../models/SavedResumesResponse";
import {auth} from "../Firebase";

class JobApplicationService {
    private async getAuthenticatedUser(): Promise<User> {
        if (auth.currentUser) {
            return auth.currentUser;
        }

        return new Promise<User>((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(
                auth,
                (user) => {
                    unsubscribe();
                    if (user) {
                        resolve(user);
                    } else {
                        reject(new Error("User is not authenticated."));
                    }
                },
                (error) => {
                    unsubscribe();
                    reject(error);
                }
            );
        });
    }

    /**
     * Fetch all job applications from the `jobApplications` collection.
     * @returns A promise with an array of job applications.
     * Save a job application to Firestore.
     * @param uid - The user's unique ID.
     * @param jobApplication - The job application data.
     * @returns A promise indicating the save operation's success or failure.
     */

    async saveJobApplication(uid: string, jobApplication?: any): Promise<void> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();

        if (!uid) {
            throw new Error("User ID (uid) is required.");
        }

        if (!jobApplication) {
            throw new Error("Job application data is required.");
        }

        try {
            // Always save under the authenticated uid so read/write paths stay consistent.
            const userJobApplicationsRef = collection(db, `jobApplications/${user.uid}/applications`);
            await addDoc(userJobApplicationsRef, jobApplication);
        } catch (error) {
            console.error("Error saving job application:", error);
            throw new Error("Failed to save job application.");
        }
    }

    async deleteJobApplication(uid: string, jobApplicationId: string): Promise<void> {
        const db = getFirestore();

        if (!uid) {
            throw new Error("User ID (uid) is required.");
        }

        if (!jobApplicationId) {
            throw new Error("Job Application ID is required.");
        }

        try {
            // Reference to the specific document in the user's job applications sub-collection
            const jobApplicationDocRef = doc(db, `jobApplications/${uid}/applications/${jobApplicationId}`);

            // Delete the document
            await deleteDoc(jobApplicationDocRef);

            // console.log(`Job application with ID ${jobApplicationId} for user ${uid} has been deleted successfully.`);
        } catch (error) {
            console.error("Error deleting job application:", error);
            throw new Error("Failed to delete job application.");
        }
    }


    async getAllJobApplications(): Promise<JobApplicationsResponse[]> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();

        const userJobApplicationsRef = collection(db, `jobApplications/${user.uid}/applications`);

        try {
            const querySnapshot = await getDocs(userJobApplicationsRef);

            const jobApplications: JobApplicationsResponse[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data() as JobApplicationInfo,
            }));

            // console.log("Job applications fetched successfully:", jobApplications);
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
            void userResumeDataRef;

            // Add a new document with auto-generated ID in the user's sub-collection
            //
            // console.log(
            //     `Resume data for user ${uid} has been saved successfully with ID: ${docRef.id}`
            // );
        } catch (error) {
            console.error("Error saving resume data:", error);
            throw new Error("Failed to save resume data.");
        }
    }

    async getAllSavedResumes(): Promise<SavedResumesResponse[]> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();

        const userSavedResumesRef = collection(db, `resumes/${user.uid}/data`);

        try {
            const querySnapshot = await getDocs(userSavedResumesRef);

            const savedResumes: SavedResumesResponse[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data() as ResumeInfo,
            }));

            // console.log("Resumes fetched successfully:", savedResumes);
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

            // console.log(`Resume with ID ${resumeId} for user ${uid} has been deleted successfully.`);
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

            // console.log(`Resume with ID ${resumeId} for user ${uid} has been updated successfully.`);
        } catch (error) {
            console.error("Error updating resume data:", error);
            throw new Error("Failed to update resume data.");
        }
    }

    async saveRules(uid: string, rules: string[]): Promise<void> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();
        const userRulesDocPath = `rules/${user.uid}/rules/rulesList`;

        if (!Array.isArray(rules)) {
            throw new Error("Rules must be an array.");
        }

        try {
            const userRulesDocRef = doc(db, userRulesDocPath);
            await setDoc(userRulesDocRef, { rules });

            // console.log(`Rules for user ${uid} have been saved successfully.`);
        } catch (error) {
            console.error("Error saving user rules:", error);
            throw new Error("Failed to save user rules.");
        }
    }


    async getRules(uid: string): Promise<string[]> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();
        const userRulesDocPath = `rules/${user.uid}/rules/rulesList`;

        try {
            const userRulesDocRef = doc(db, userRulesDocPath);
            const docSnapshot = await getDoc(userRulesDocRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data() as { rules: string[] };
                return data.rules || [];
            } else {
                console.log(`No rules document found for user ${uid}.`);
                return [];
            }
        } catch (error) {
            console.error(`Error retrieving rules for user ${uid}:`, error);
            throw new Error("Failed to retrieve user rules.");
        }
    }

}

const jobApplicationService = new JobApplicationService();

export default jobApplicationService;
