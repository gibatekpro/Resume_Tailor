import React from 'react';
import './App.css';
import {ResumePrintPage} from "./pages/ResumePrintPage";
import {ResumeProvider} from "./context/ResumeContext";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {ResumeInfoPage} from "./pages/ResumeInfoPage";
import {TestPrintPage} from "./pages/TestPrintPage";
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import 'firebase/compat/auth';
import {getAuth} from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import {AuthProvider} from "./services/auth/AuthProvider";
import {Navbar} from "./components/Navbar";
import ROUTES from "./data/routes";
import {RegisterPage} from "./pages/auth/RegisterPage";
import {LoginPage} from "./pages/auth/LoginPage";
import {ResetPasswordPage} from "./pages/auth/ResetPasswordPage";
import {RequireAuth} from "./services/auth/RequireAuth";
import {firebaseConfig} from "./data/applicationData";
import {ResumePreviewPage} from "./pages/ApplicationPreviewPage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar/>
                <ResumeProvider>
                    <Routes>
                        <Route path={ROUTES.HOME} element={<HomePage />} />
                        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                        <Route path={ROUTES.PASSWORD_RESET} element={<ResetPasswordPage />} />
                        <Route path={ROUTES.RESUME_INPUT_PAGE}
                               element={
                                   <RequireAuth>
                                       <ResumeInfoPage />
                                   </RequireAuth>
                               }>
                        </Route>
                        <Route path={ROUTES.APPLICATION_PREVIEW}
                               element={
                                   <RequireAuth>
                                       <ResumePreviewPage />
                                   </RequireAuth>
                               }>
                        </Route>
                        <Route path={ROUTES.RESUME_PRINT_PAGE}
                               element={
                                   <RequireAuth>
                                       <ResumePrintPage />
                                   </RequireAuth>
                               }>
                        </Route>
                    </Routes>
                </ResumeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
