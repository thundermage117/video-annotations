import React, { useState, useEffect } from 'react';
import AnnotationManager from './AnnotationManager';
import axios from 'axios';

const App = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [annotations, setAnnotations] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchVideos();  // Fetch videos on component mount
    }, []);

    useEffect(() => {
        console.log("Selected video changed:", selectedVideo);
        // Clear annotations when video changes
        setAnnotations([]);
    }, [selectedVideo]);

    const fetchVideos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/videos');
            console.log("Fetched videos:", response.data);
            setVideos(response.data.videos);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };

    const handleVideoSelect = (event) => {
        console.log("Video selected:", event.target.value);
        setSelectedVideo(event.target.value);
        // Optionally, fetch annotations for the selected video here if needed
    };

    const handleFileChange = (event) => {
        setUploadFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append('file', uploadFile);

        try {
            setUploading(true);
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await fetchVideos();  // Refresh the video list after uploading
            alert(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setUploading(false);
            setUploadFile(null);
        }
    };

    return (
        <div>
            <h1>Video Annotation Tool</h1>

            <div>
                <label htmlFor="video-select">Select a video:</label>
                <select id="video-select" value={selectedVideo} onChange={handleVideoSelect}>
                    <option value="">Select a video</option>
                    {videos.map((video) => (
                        <option key={video.url} value={video.url}>
                            {video.filename}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <h2>Upload a new video</h2>
                <form onSubmit={handleUpload}>
                    <input type="file" accept="video/*" onChange={handleFileChange} />
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </form>
            </div>

            {selectedVideo && (
                <AnnotationManager
                    videoSrc={selectedVideo}
                    annotations={annotations}
                    setAnnotations={setAnnotations}
                />
            )}
        </div>
    );
};

export default App;
