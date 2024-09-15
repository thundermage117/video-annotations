// src/AnnotationManager.js
import React, { useState, useRef, useEffect } from 'react';

const predefinedTags = ['Car', 'Tree', 'Building'];

const AnnotationManager = ({ videoSrc, annotations, setAnnotations }) => {
    const [currentTag, setCurrentTag] = useState('');
    const [drawing, setDrawing] = useState(false);
    const [rect, setRect] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context && rect) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = 'red';
            context.lineWidth = 2;
            context.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
        }
    }, [rect]);

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
        };
        setAnnotations([...annotations, newAnnotation]);
        setRect(null);
        setDrawing(false);
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    return (
        <div>
            <h2>Annotations</h2>
            <select value={currentTag} onChange={(e) => setCurrentTag(e.target.value)}>
                <option value="">Select a tag</option>
                {predefinedTags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>
            <button onClick={handleMouseUp}>Save Annotation</button>

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
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnnotationManager;
