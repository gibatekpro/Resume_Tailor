import React from 'react';
import './App.css';
import {ResumePrintPage} from "./pages/ResumePrintPage";
import {ResumeProvider} from "./context/ResumeContext";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import {ResumeInputPage} from "./pages/ResumeInputPage";

function App() {
    return (
        <Router>
            <ResumeProvider>
                <Routes>
                    <Route path="/" element={<ResumePrintPage />} >
                    </Route>
                    <Route path="/input" element={<ResumeInputPage />} >
                    </Route>
                </Routes>
            </ResumeProvider>
        </Router>
    );
}

export default App;
