import React, { useState, useEffect } from 'react';
import AnnotationManager from './AnnotationManager';

const App = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [videoId, setVideoId] = useState('');

    // Fetch videos from the backend
    const fetchVideos = async () => {
        try {
            const response = await fetch('http://localhost:5000/videos');
            if (!response.ok) throw new Error('Failed to fetch videos');
            const data = await response.json();
            setVideos(data);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
        }
    };

    // Fetch annotations for a selected video
    const fetchAnnotations = async (videoId) => {
        try {
            const response = await fetch(`http://localhost:5000/annotations/${videoId}`);
            if (!response.ok) throw new Error('Failed to fetch annotations');
            const data = await response.json();
            setAnnotations(data);
        } catch (error) {
            console.error('Failed to fetch annotations:', error);
        }
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload file');
            const data = await response.json();
            setSelectedVideo(data.videoUrl);
            // Optionally, refetch the list of videos
            await fetchVideos(); // Fetch videos after upload
        } catch (error) {
            console.error('Failed to upload file:', error);
        }
    };

    // Handle video selection
    const handleVideoChange = (e) => {
        const videoSrc = e.target.value;
        setSelectedVideo(videoSrc);
        const selectedVideoId = videos.find(video => video.url === videoSrc)?.id;
        setVideoId(selectedVideoId);
        // Fetch annotations for the selected video
        if (selectedVideoId) {
            fetchAnnotations(selectedVideoId);
        }
    };

    useEffect(() => {
        fetchVideos(); // Fetch videos when the component mounts
    }, []);

    return (
        <div>
            <h1>Video Annotation Tool</h1>
            <input type="file" accept="video/*" onChange={handleFileUpload} />
            <div>
                <select value={selectedVideo} onChange={handleVideoChange}>
                    <option value="">Select a video</option>
                    {videos.map((video) => (
                        <option key={video.id} value={video.url}>
                            {video.name}
                        </option>
                    ))}
                </select>
            </div>
            {selectedVideo && (
                <AnnotationManager
                    videoSrc={selectedVideo}
                    annotations={annotations}
                    setAnnotations={setAnnotations}
                    videoId={videoId}
                />
            )}
        </div>
    );
};

export default App;
