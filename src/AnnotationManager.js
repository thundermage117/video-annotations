import React, { useState, useRef, useEffect } from 'react';

const predefinedTags = ['Car', 'Tree', 'Building'];
const predefinedColors = ['red', 'green', 'blue', 'yellow', 'purple']; // Define some colors


const AnnotationManager = ({ videoSrc, annotations, setAnnotations, selectedVideoId }) => {
  const [currentTag, setCurrentTag] = useState('');
  const [currentColor, setCurrentColor] = useState('red'); // Default color
  const [drawing, setDrawing] = useState(false);
  const [rect, setRect] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle rendering of the canvas when the rectangle or color changes
  useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context && rect) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.strokeStyle = currentColor; // Use the current color
          context.lineWidth = 2;
          context.strokeRect(rect.startX, rect.startY, rect.width, rect.height);
      }
  }, [rect, currentColor]);

  // Reload video when videoSrc changes
  useEffect(() => {
      if (videoRef.current) {
          videoRef.current.load(); // Reload the video when the source changes
          setRect(null);           // Clear any annotations or drawings
          setCurrentTime(null);     // Reset the current time
          setEditingIndex(null);    // Exit editing mode if applicable
      }
  }, [videoSrc]);

    // Clear canvas when video source changes
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        setRect(null); // Clear any existing rectangle
    }, [videoSrc]);

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

    const handleMouseUp = async () => {
      if (!rect || !currentTag || currentTime === null || currentTime === undefined) {
          console.error('Missing required fields for annotation');
          return;
      }
  
      // Ensure currentTime is a valid number
      const validCurrentTime = Number(currentTime);
      if (isNaN(validCurrentTime) || validCurrentTime < 0) {
          console.error('Invalid currentTime value:', currentTime);
          return;
      }
  
      const newAnnotation = {
          tag: currentTag,
          time: validCurrentTime,
          x: rect.startX,
          y: rect.startY,
          width: rect.width,
          height: rect.height,
          color: currentColor,
      };
  
      try {
          if (editingIndex !== null) {
              // Update existing annotation
              const annotationToUpdate = annotations[editingIndex];
              const response = await fetch(`http://localhost:5000/annotations/${selectedVideoId}/${annotationToUpdate.id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newAnnotation),
              });
              // Print request to console
              console.log(`PUT http://localhost:5000/annotations/${selectedVideoId}/${annotationToUpdate.id}`);
              // Print request body to console
              console.log(JSON.stringify(newAnnotation));
              if (!response.ok) throw new Error('Failed to update annotation');
              const updatedAnnotations = [...annotations];
              updatedAnnotations[editingIndex] = newAnnotation;
              setAnnotations(updatedAnnotations);
              setEditingIndex(null);
          } else {
              // Add new annotation
              const response = await fetch(`http://localhost:5000/annotations/${selectedVideoId}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(newAnnotation),
              });
              // Print request to console
              console.log(`POST http://localhost:5000/annotations/${selectedVideoId}`);
              // Print request body to console
              console.log(JSON.stringify(newAnnotation));
              if (!response.ok) throw new Error('Failed to save annotation');
              const savedAnnotation = await response.json();
              setAnnotations([...annotations, savedAnnotation]);
          }
      } catch (error) {
          console.error('Error saving annotation:', error);
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

    const handleDeleteAnnotation = async (index) => {
      const annotationToDelete = annotations[index];
      try {
          const response = await fetch(`http://localhost:5000/annotations/${selectedVideoId}/${annotationToDelete.id}`, {
              method: 'DELETE',
          });
          if (!response.ok) throw new Error('Failed to delete annotation');
          setAnnotations(annotations.filter((_, i) => i !== index));
          setEditingIndex(null);
      } catch (error) {
          console.error('Error deleting annotation:', error);
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
            <select value={currentColor} onChange={(e) => setCurrentColor(e.target.value)}>
                {predefinedColors.map((color) => (
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
    {annotations.map((annotation, index) => {
        const date = new Date(annotation.time * 1000); // Convert time to Date object
        const hours = String(date.getUTCHours()).padStart(2, '0'); // Pad hours to 2 digits
        const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Pad minutes to 2 digits
        const seconds = String(date.getUTCSeconds()).padStart(2, '0'); // Pad seconds to 2 digits
        const formattedTime = `${hours}:${minutes}:${seconds}`; // Format as HH:MM:SS

        return (
            <li key={index}>
                {annotation.tag} at {formattedTime} - Rectangle: ({annotation.x}, {annotation.y}, {annotation.width}, {annotation.height})
                <span style={{ color: annotation.color }}> ● </span>
                <button onClick={() => handleAnnotationSelect(index)}>Edit</button>
                <button onClick={() => handleDeleteAnnotation(index)}>Delete</button>
            </li>
        );
    })}
</ul>

        </div>
    );
};

export default AnnotationManager;
