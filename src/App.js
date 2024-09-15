// src/App.js
import React, { useState } from 'react';
import './App.css';
import VideoUploader from './VideoUploader';
import VideoPlayer from './VideoPlayer';

function App() {
    const [videoSrc, setVideoSrc] = useState('');

    return (
        <div className="App">
            <h1>Video Annotation Tool</h1>
            <VideoUploader setVideoSrc={setVideoSrc} />
            {videoSrc && (
                <>
                    <h2>Uploaded Video:</h2>
                    <VideoPlayer videoSrc={videoSrc} />
                </>
            )}
        </div>
    );
}

export default App;
