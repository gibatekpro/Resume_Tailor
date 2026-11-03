import {readFileSync} from "node:fs";
import {afterAll, beforeAll, beforeEach, describe, it} from "vitest";
import {assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment} from "@firebase/rules-unit-testing";
import {deleteDoc, doc, getDoc, getDocs, collection, setDoc} from "firebase/firestore";

// Runs firestore.rules in the Firestore emulator. Skipped unless the emulator is running: use `npm run test:rules`.
describe.skipIf(!process.env.FIRESTORE_EMULATOR_HOST)("Firestore security rules", () => {
    let env: RulesTestEnvironment;

    beforeAll(async () => {
        env = await initializeTestEnvironment({
            projectId: "demo-resume-tailor",
            firestore: {rules: readFileSync("firestore.rules", "utf8")},
        });
    });

    afterAll(async () => {
        await env?.cleanup();
    });

    // Alice is a normal user with a profile, Admin is an admin; data is written with the rules turned off.
    beforeEach(async () => {
        await env.clearFirestore();
        await env.withSecurityRulesDisabled(async (context) => {
            const db = context.firestore();
            await setDoc(doc(db, "users/alice"), {uid: "alice", firstName: "Alice", permission: "User"});
            await setDoc(doc(db, "users/admin"), {uid: "admin", firstName: "Ada", permission: "Admin"});
            await setDoc(doc(db, "rateLimits/alice"), {tailor: {windowStart: 0, count: 40}});
        });
    });

    const as = (uid: string) => env.authenticatedContext(uid).firestore();

    describe("profiles", () => {
        it("lets a user create and edit their own profile", async () => {
            await assertSucceeds(setDoc(doc(as("bob"), "users/bob"), {uid: "bob", firstName: "Bob", permission: "User"}));
            await assertSucceeds(setDoc(doc(as("alice"), "users/alice"), {firstName: "Alicia", permission: "User"}, {merge: true}));
        });

        it("doesn't let a user give themselves Admin or AI access", async () => {
            await assertFails(setDoc(doc(as("bob"), "users/bob"), {uid: "bob", permission: "Admin"}));
            await assertFails(setDoc(doc(as("bob"), "users/bob"), {uid: "bob", aiAccess: true}));
            await assertFails(setDoc(doc(as("alice"), "users/alice"), {permission: "Admin"}, {merge: true}));
            await assertFails(setDoc(doc(as("alice"), "users/alice"), {aiAccess: true}, {merge: true}));
        });

        it("doesn't let a user read or write someone else's profile", async () => {
            await assertFails(getDoc(doc(as("alice"), "users/admin")));
            await assertFails(setDoc(doc(as("alice"), "users/bob"), {uid: "bob", permission: "User"}));
            await assertFails(getDocs(collection(as("alice"), "users")));
            await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), "users/alice")));
        });

        it("lets an admin list users and grant a role and AI access", async () => {
            await assertSucceeds(getDocs(collection(as("admin"), "users")));
            await assertSucceeds(setDoc(doc(as("admin"), "users/alice"), {aiAccess: true, permission: "User"}, {merge: true}));
            await assertSucceeds(setDoc(doc(as("admin"), "users/bob"), {uid: "bob", permission: "Admin", aiAccess: false}, {merge: true}));
        });

        it("doesn't let anyone delete a profile", async () => {
            await assertFails(deleteDoc(doc(as("alice"), "users/alice")));
        });
    });

    describe("rate limits", () => {
        it("are closed to every client, even the owner and admins", async () => {
            await assertFails(getDoc(doc(as("alice"), "rateLimits/alice")));
            await assertFails(setDoc(doc(as("alice"), "rateLimits/alice"), {tailor: {windowStart: 0, count: 0}}));
            await assertFails(deleteDoc(doc(as("alice"), "rateLimits/alice")));
            await assertFails(getDoc(doc(as("admin"), "rateLimits/alice")));
        });
    });

    describe("each user's own data", () => {
        for (const path of ["jobApplications/alice/applications/a1", "resumes/alice/data/r1", "rules/alice/rules/rulesList"]) {
            it(`only the owner can use ${path.split("/")[0]}`, async () => {
                await assertSucceeds(setDoc(doc(as("alice"), path), {value: 1}));
                await assertSucceeds(getDoc(doc(as("alice"), path)));
                await assertFails(getDoc(doc(as("bob"), path)));
                await assertFails(setDoc(doc(as("bob"), path), {value: 2}));
            });
        }
    });

    it("closes paths the app doesn't use", async () => {
        await assertFails(setDoc(doc(as("alice"), "anything/else"), {value: 1}));
    });
});
