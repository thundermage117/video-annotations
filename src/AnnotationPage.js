import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnotationManager from './AnnotationManager'; // Reuse your AnnotationManager component

const AnnotationPage = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [videoSrc, setVideoSrc] = useState('');
    const [videoLoaded, setVideoLoaded] = useState(false); // New state to track if video is loaded

    // Fetch videos from backend
    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:5000/videos');
            if (!response.ok) throw new Error('Failed to fetch videos');
            const data = await response.json();
            setVideos(data);
            if (data.length > 0) {
                setSelectedVideoId(data[0].id); // Select the first video by default
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    // Fetch video URL and annotations only when the "Use This Video" button is clicked
    const handleUseThisVideo = async () => {
        setVideoLoaded(false); // Reset loading state
        try {
            if (selectedVideoId) {
                // Fetch the video URL
                const videoResponse = await fetch(`http://localhost:5000/video_url/${selectedVideoId}`);
                if (!videoResponse.ok) throw new Error('Failed to fetch video URL');
                const videoData = await videoResponse.json();
                setVideoSrc(videoData.url);

                // Fetch annotations for the selected video
                const annotationsResponse = await fetch(`http://localhost:5000/annotations/${selectedVideoId}`);
                if (!annotationsResponse.ok) throw new Error('Failed to fetch annotations');
                const annotationsData = await annotationsResponse.json();
                setAnnotations(annotationsData);

                // Set video as loaded
                setVideoLoaded(true);
            }
        } catch (error) {
            console.error('Error loading video or annotations:', error);
        }
    };

    return (
        <div>
            <h1>Video Annotation Tool</h1>

            {/* Link to Upload Page */}
            <Link to="/">← Back to Upload Page</Link>

            <div>
                <label>Select Video: </label>
                <select value={selectedVideoId || ''} onChange={(e) => setSelectedVideoId(e.target.value)}>
                    {videos.map((video) => (
                        <option key={video.id} value={video.id}>
                            {video.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Button to trigger loading the selected video */}
            <button onClick={handleUseThisVideo}>Use This Video</button>

            {/* Show Annotation Manager only after video and annotations are loaded */}
            {videoLoaded && videoSrc && selectedVideoId && (
                <div>
                    <AnnotationManager
                        videoSrc={videoSrc}
                        annotations={annotations}
                        setAnnotations={setAnnotations}
                        selectedVideoId={selectedVideoId}
                    />
                </div>
            )}
        </div>
    );
};

export default AnnotationPage;
