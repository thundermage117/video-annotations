import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import UploadPage from './UploadPage'; // Import UploadPage
import AnnotationPage from './AnnotationPage'; // Import AnnotationPage
import './App.css';

const App = () => {
    return (
        <Router>
            <div>
                {/* Navigation Bar */}
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Upload Page</Link>
                        </li>
                        <li>
                            <Link to="/annotate">Annotation Page</Link>
                        </li>
                    </ul>
                </nav>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<UploadPage />} /> {/* Default path (Upload Page) */}
                    <Route path="/annotate" element={<AnnotationPage />} /> {/* Annotation Page */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
