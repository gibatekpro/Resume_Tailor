import React from 'react';
import './App.css';
import {ResumePrintPage} from "./pages/ResumePrintPage";
import {ResumeProvider} from "./context/ResumeContext";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {ResumeInputPage} from "./pages/ResumeInputPage";
import {HomePage} from "./pages/HomePage";
import {ResumeInfoPage} from "./pages/ResumeInfoPage";

function App() {
    return (
        <Router>
            <ResumeProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} >
                    </Route>
                    <Route path="/print" element={<ResumePrintPage />} >
                    </Route>
                    <Route path="/input" element={<ResumeInfoPage />} >
                    </Route>
                </Routes>
            </ResumeProvider>
        </Router>
    );
}

export default App;
