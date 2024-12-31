import React, {useEffect, useState} from 'react';
import './App.css';
import {ResumePrintPage} from "./pages/ResumePrintPage";
import {ResumeProvider} from "./context/ResumeContext";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {initializeApp} from "firebase/app";
import 'firebase/compat/auth';
import "firebase/firestore";
import {AuthProvider} from "./context/auth/AuthProvider";
import {Navbar} from "./components/Navbar";
import ROUTES from "./data/routes";
import {RegisterPage} from "./pages/auth/RegisterPage";
import {LoginPage} from "./pages/auth/LoginPage";
import {ResetPasswordPage} from "./pages/auth/ResetPasswordPage";
import {RequireAuth} from "./context/auth/RequireAuth";
import {APP_TITLE, firebaseConfig, LOCAL_STORAGE_APP_TITLE} from "./data/applicationData";
import {JobApplicationPreviewPage} from "./pages/JobApplicationPreviewPage";
import {TailorResumePage} from "./pages/TailorResumePage";
import {MyJobApplications} from "./pages/MyJobApplications";
import {Row} from "react-bootstrap";
import {CreateCV} from "./pages/CreateCV";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

function App() {
    const [hideNavbar, setHideNavbar] = useState(false);
    const [appTitle, setAppTitle] = useState<string>(localStorage.getItem(LOCAL_STORAGE_APP_TITLE) || APP_TITLE);

    useEffect(() => {
        document.title = appTitle
    }, [appTitle]);

    return (
        <Router>
            <AuthProvider>
                <div>
                    <Row>
                        <Navbar hide={hideNavbar}/>
                        <ResumeProvider>
                            <Routes>
                                <Route path={ROUTES.HOME} element={<HomePage/>}/>
                                <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
                                <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
                                <Route path={ROUTES.PASSWORD_RESET} element={<ResetPasswordPage/>}/>
                                <Route path={ROUTES.RESUME_INPUT_PAGE}
                                       element={
                                           <RequireAuth>
                                               <TailorResumePage/>
                                           </RequireAuth>
                                       }>
                                </Route>
                                <Route path={ROUTES.APPLICATION_PREVIEW}
                                       element={
                                           <RequireAuth>
                                               <JobApplicationPreviewPage setHideNavbar={setHideNavbar}
                                                                          setAppTitle={setAppTitle}/>
                                           </RequireAuth>
                                       }>
                                </Route>
                                <Route path={ROUTES.RESUME_PRINT_PAGE}
                                       element={
                                           <RequireAuth>
                                               <ResumePrintPage setHideNavbar={setHideNavbar}
                                                                setAppTitle={setAppTitle}/>
                                           </RequireAuth>
                                       }>
                                </Route>
                                <Route path={ROUTES.NEW_CV_PAGE}
                                       element={
                                           <RequireAuth>
                                               <CreateCV/>
                                           </RequireAuth>
                                       }>
                                </Route>
                                <Route path={ROUTES.MY_JOB_APPLICATIONS}
                                       element={
                                           <RequireAuth>
                                               <MyJobApplications/>
                                           </RequireAuth>
                                       }>
                                </Route>
                            </Routes>
                        </ResumeProvider>
                    </Row>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
