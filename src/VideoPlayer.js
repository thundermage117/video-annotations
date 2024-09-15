// src/VideoPlayer.js
import React from 'react';

const VideoPlayer = ({ videoSrc }) => {
    return (
        <div>
            <video
                width="600"
                controls
                style={{ border: '1px solid #ccc', display: 'block', margin: '20px auto', maxWidth: '100%' }}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default VideoPlayer;
