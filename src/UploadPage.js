import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UploadPage = () => {
    const [uploadFile, setUploadFile] = useState(null);

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
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <h1>Upload Video</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>

            {/* Link to Annotation Page */}
            <div>
                <Link to="/annotate">Go to Annotation Page →</Link>
            </div>
        </div>
    );
};

export default UploadPage;
