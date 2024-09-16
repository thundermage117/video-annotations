import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnnotationManager from './AnnotationManager'; // Reuse your AnnotationManager component

const AnnotationPage = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [videoSrc, setVideoSrc] = useState('');

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

    // Fetch video URL when a video is selected
    useEffect(() => {
        const fetchVideoUrl = async () => {
            if (selectedVideoId) {
                try {
                    const response = await fetch(`http://localhost:5000/video_url/${selectedVideoId}`);
                    if (!response.ok) throw new Error('Failed to fetch video URL');
                    const data = await response.json();
                    setVideoSrc(data.url);
                } catch (error) {
                    console.error('Error fetching video URL:', error);
                }
            }
        };

        fetchVideoUrl();
    }, [selectedVideoId]);

    // Fetch annotations when video changes
    useEffect(() => {
        const fetchAnnotations = async () => {
            if (!selectedVideoId) return;
            try {
                const response = await fetch(`http://localhost:5000/annotations/${selectedVideoId}`);
                if (!response.ok) throw new Error('Failed to fetch annotations');
                const data = await response.json();
                setAnnotations(data);
            } catch (error) {
                console.error('Error fetching annotations:', error);
            }
        };

        fetchAnnotations();
    }, [selectedVideoId]);

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

            {videoSrc && selectedVideoId && (
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
