import React from 'react';
import './App.css';
import {ResumePrintPage} from "./pages/ResumePrintPage";
import {ResumeProvider} from "./context/ResumeContext";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import {ResumeInfoPage} from "./pages/ResumeInfoPage";
import {TestPrintPage} from "./pages/TestPrintPage";

function App() {
    return (
        <Router>
            <ResumeProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} >
                    </Route>
                    <Route path="/print" element={<TestPrintPage />} >
                    </Route>
                    <Route path="/input" element={<ResumeInfoPage />} >
                    </Route>
                </Routes>
            </ResumeProvider>
        </Router>
    );
}

export default App;
