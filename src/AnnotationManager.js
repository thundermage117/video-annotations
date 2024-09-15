import React, { useState, useRef, useEffect } from 'react';

const AnnotationManager = ({ videoSrc, annotations, setAnnotations, videoId }) => {
    const [currentTag, setCurrentTag] = useState('');
    const [currentColor, setCurrentColor] = useState('red'); // Default color
    const [drawing, setDrawing] = useState(false);
    const [rect, setRect] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Draw all annotations
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
            annotations.forEach(annotation => {
                context.strokeStyle = annotation.color; // Use the color of the annotation
                context.lineWidth = 2;
                context.strokeRect(
                    annotation.x,
                    annotation.y,
                    annotation.width,
                    annotation.height
                );
            });
        }
    }, [annotations, videoSrc, videoId]); // Add videoId as dependency to redraw on video change

    useEffect(() => {
        if (editingIndex !== null) {
            const annotation = annotations[editingIndex];
            setCurrentTag(annotation.tag);
            setCurrentColor(annotation.color); // Set the color for editing
            setRect({
                startX: annotation.x,
                startY: annotation.y,
                width: annotation.width,
                height: annotation.height,
                x: annotation.x,
                y: annotation.y
            });
            videoRef.current.currentTime = annotation.time;
        }
    }, [editingIndex, annotations]);

    const handleMouseDown = (e) => {
        if (!videoRef.current) return;

        const rect = videoRef.current.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        setDrawing(true);
        setRect({ startX, startY, x: startX, y: startY });
    };

    const handleMouseMove = (e) => {
        if (!drawing || !videoRef.current) return;

        const rect = videoRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRect((prevRect) => ({
            ...prevRect,
            width: x - prevRect.startX,
            height: y - prevRect.startY,
        }));
    };

    const handleMouseUp = () => {
        if (!rect || !currentTag) return;

        const newAnnotation = {
            tag: currentTag,
            time: currentTime,
            x: rect.startX,
            y: rect.startY,
            width: rect.width,
            height: rect.height,
            color: currentColor, // Include the color
        };

        if (editingIndex !== null) {
            // Update existing annotation
            const updatedAnnotations = [...annotations];
            updatedAnnotations[editingIndex] = newAnnotation;
            setAnnotations(updatedAnnotations);
            setEditingIndex(null);
        } else {
            // Add new annotation
            setAnnotations([...annotations, newAnnotation]);
        }

        setRect(null);
        setDrawing(false);
        setCurrentTag('');
        setCurrentColor('red'); // Reset color to default after saving
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleAnnotationSelect = (index) => {
        setEditingIndex(index);
        videoRef.current.currentTime = annotations[index].time;
    };

    const handleDeleteAnnotation = (index) => {
        setAnnotations(annotations.filter((_, i) => i !== index));
        setEditingIndex(null);
    };

    return (
        <div>
            <h2>Annotations</h2>
            <select value={currentTag} onChange={(e) => setCurrentTag(e.target.value)}>
                <option value="">Select a tag</option>
                {['Car', 'Tree', 'Building'].map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
            <select value={currentColor} onChange={(e) => setCurrentColor(e.target.value)}>
                {['red', 'green', 'blue', 'yellow', 'purple'].map((color) => (
                    <option key={color} value={color} style={{ backgroundColor: color }}>
                        {color}
                    </option>
                ))}
            </select>
            <button onClick={handleMouseUp}>{editingIndex !== null ? 'Update Annotation' : 'Save Annotation'}</button>

            <div
                style={{ position: 'relative', width: '600px', margin: '20px auto' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <video
                    width="600"
                    controls
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    style={{ border: '1px solid #ccc' }}
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={videoRef.current?.clientHeight || 0}
                    style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
                />
            </div>

            <ul>
                {annotations.map((annotation, index) => (
                    <li key={index}>
                        {annotation.tag} at {new Date(annotation.time * 1000).toISOString().substr(11, 8)} - Rectangle: ({annotation.x}, {annotation.y}, {annotation.width}, {annotation.height})
                        <span style={{ color: annotation.color }}> ● </span>
                        <button onClick={() => handleAnnotationSelect(index)}>Edit</button>
                        <button onClick={() => handleDeleteAnnotation(index)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnnotationManager;
