import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {onAuthStateChanged, type User} from "firebase/auth";
import {auth} from "../Firebase";
import type {AppSettings} from "../models/AppSettings";
import type {SavedSite} from "../models/SavedSite";
import {DefaultSettings} from "../data/defaultSettings";
import STORAGE from "../utils/storage";

// Makes sure the default is always one of the listed models and the list is never empty.
const normaliseSettings = (settings?: Partial<AppSettings>): AppSettings => {
    const models = [...new Set((settings?.models || []).map((model) => model.trim()).filter(Boolean))];
    if (models.length === 0) {
        return DefaultSettings;
    }
    const defaultModel = settings?.defaultModel && models.includes(settings.defaultModel) ? settings.defaultModel : models[0];
    return {models, defaultModel};
};

class SettingsService {
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

    // Last saved settings on this device, available instantly before Firestore answers.
    getCachedSettings(): AppSettings {
        try {
            return normaliseSettings(JSON.parse(localStorage.getItem(STORAGE.SETTINGS) || "null") || undefined);
        } catch {
            return DefaultSettings;
        }
    }

    async getSettings(): Promise<AppSettings> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();

        try {
            // Stored next to the user's rules, so it's covered by the same Firestore security rules.
            const docSnapshot = await getDoc(doc(db, `rules/${user.uid}/rules/settings`));
            const settings = docSnapshot.exists()
                ? normaliseSettings(docSnapshot.data() as AppSettings)
                : this.getCachedSettings();
            localStorage.setItem(STORAGE.SETTINGS, JSON.stringify(settings));
            return settings;
        } catch (error) {
            console.error("Error retrieving settings:", error);
            return this.getCachedSettings();
        }
    }

    async saveSettings(settings: AppSettings): Promise<AppSettings> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();
        const normalised = normaliseSettings(settings);

        localStorage.setItem(STORAGE.SETTINGS, JSON.stringify(normalised));
        try {
            await setDoc(doc(db, `rules/${user.uid}/rules/settings`), normalised);
        } catch (error) {
            console.error("Error saving settings:", error);
            throw new Error("Failed to save settings.", {cause: error});
        }
        return normalised;
    }

    getCachedSavedSites(): SavedSite[] {
        try {
            return JSON.parse(localStorage.getItem(STORAGE.SAVED_SITES) || "[]");
        } catch {
            return [];
        }
    }

    async getSavedSites(): Promise<SavedSite[]> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();

        try {
            const docSnapshot = await getDoc(doc(db, `rules/${user.uid}/rules/savedSites`));
            const sites = docSnapshot.exists()
                ? ((docSnapshot.data() as {sites?: SavedSite[]}).sites || [])
                : this.getCachedSavedSites();
            localStorage.setItem(STORAGE.SAVED_SITES, JSON.stringify(sites));
            return sites;
        } catch (error) {
            console.error("Error retrieving saved sites:", error);
            return this.getCachedSavedSites();
        }
    }

    async saveSavedSites(sites: SavedSite[]): Promise<void> {
        const db = getFirestore();
        const user = await this.getAuthenticatedUser();

        localStorage.setItem(STORAGE.SAVED_SITES, JSON.stringify(sites));
        try {
            await setDoc(doc(db, `rules/${user.uid}/rules/savedSites`), {sites});
        } catch (error) {
            console.error("Error saving sites:", error);
            throw new Error("Failed to save sites.", {cause: error});
        }
    }
}

const settingsService = new SettingsService();

export default settingsService;
