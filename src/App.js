// src/App.js
import React, { useState } from 'react';
import './App.css';
import VideoUploader from './VideoUploader';
import AnnotationManager from './AnnotationManager';

function App() {
    const [videoSrc, setVideoSrc] = useState('');
    const [annotations, setAnnotations] = useState([]);

    return (
        <div className="App">
            <h1>Video Annotation Tool</h1>
            <VideoUploader setVideoSrc={setVideoSrc} />
            {videoSrc && (
                <>
                    <h2>Uploaded Video:</h2>
                    <AnnotationManager videoSrc={videoSrc} annotations={annotations} setAnnotations={setAnnotations} />
                </>
            )}
        </div>
    );
}

export default App;
