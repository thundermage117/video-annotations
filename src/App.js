import React, { useState, useEffect } from 'react';
import AnnotationManager from './AnnotationManager'; // Adjust the path if necessary
import './App.css';
const App = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [annotations, setAnnotations] = useState([]);
    const [videoSrc, setVideoSrc] = useState('');
    const [uploadFile, setUploadFile] = useState(null);

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

    // Handle file upload
    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append('file', uploadFile);

        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Failed to upload file');
            const data = await response.json();
            alert('File uploaded successfully');
            setUploadFile(null);
            // Refresh video list
            await fetchVideos();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h1>Video Annotation Tool</h1>
            
            {/* Upload Form */}
            <div>
                <h2>Upload Video</h2>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload</button>
            </div>

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
                    <h2>Current Video</h2>
                    <video
                        width="600"
                        controls
                        src={videoSrc}
                        style={{ border: '1px solid #ccc' }}
                    >
                        Your browser does not support the video tag.
                    </video>
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

export default App;
