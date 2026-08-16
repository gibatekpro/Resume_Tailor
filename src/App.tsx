import React, {useEffect, useState} from 'react';
import './App.css';
import {ResumePrintPage} from "./pages/ResumePrintPage";
import {ResumeProvider} from "./context/ResumeContext";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import 'firebase/compat/auth';
import "firebase/firestore";
import {AuthProvider} from "./context/auth/AuthProvider";
import {Navbar} from "./components/Navbar";
import ROUTES from "./utils/routes";
import {RegisterPage} from "./pages/auth/RegisterPage";
import {LoginPage} from "./pages/auth/LoginPage";
import {ResetPasswordPage} from "./pages/auth/ResetPasswordPage";
import {AuthGuard} from "./context/auth/AuthGuard";
import {APP_TITLE, LOCAL_STORAGE_APP_TITLE} from "./utils/applicationData";
import {JobApplicationPreviewPage} from "./pages/JobApplicationPreviewPage";
import {TailorResumePage} from "./pages/TailorResumePage";
import {MyJobApplications} from "./pages/MyJobApplications";
import {Row} from "react-bootstrap";
import {CreateCV} from "./pages/CreateCV";
import {Example} from "./delete/testC";

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
                                <Route path={ROUTES.TEST} element={<Example/>}/>
                                <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
                                <Route path={ROUTES.REGISTER} element={<RegisterPage/>}/>
                                <Route path={ROUTES.PASSWORD_RESET} element={<ResetPasswordPage/>}/>
                                <Route element={<AuthGuard />}>
                                    <Route path={ROUTES.RESUME_INPUT_PAGE} element={<TailorResumePage/>}/>
                                    <Route path={ROUTES.NEW_CV_PAGE} element={<CreateCV/>}/>
                                    <Route path={ROUTES.MY_JOB_APPLICATIONS} element={<MyJobApplications/>}/>
                                    <Route path={ROUTES.RESUME_PRINT_PAGE} element={<ResumePrintPage setHideNavbar={setHideNavbar}
                                                                                                     setAppTitle={setAppTitle}/>}/>
                                    <Route path={ROUTES.APPLICATION_PREVIEW} element={<JobApplicationPreviewPage setHideNavbar={setHideNavbar}
                                                                                                                 setAppTitle={setAppTitle}/>}/>

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
