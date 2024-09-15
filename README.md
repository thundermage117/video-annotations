# Video Annotation Tool

## Overview

The Video Annotation Tool allows users to annotate videos with custom tags and colors. Annotations can be used to mark specific objects or events within a video. This tool is built with React for the frontend and Flask for the backend, using PostgreSQL to store video and annotation data.

## Features

- **Video Selection and Playback:**
  - Select a video from a dropdown menu.
  - View and play the selected video in the player.

- **Annotation Management:**
  - Draw rectangles on the video to annotate specific areas.
  - Customize annotations with predefined tags and colors.
  - Add and save new annotations with a click.
  - Edit existing annotations.
  - Delete annotations.

- **Drawing and Editing Annotations:**
  - Draw rectangles by clicking and dragging on the video.
  - Use the annotation toolbar to select tags and colors.
  - Adjust annotation attributes and save changes.

- **Backend Integration:**
  - Fetch video URLs and annotations from the backend.
  - Save new annotations to the backend database.
  - Load existing annotations when selecting a video.

- **File Upload:**
  - Upload new video files to the backend server.
  - Automatically update the video list after a successful upload.

## Installation

### Prerequisites

- Node.js
- Python
- PostgreSQL

### Backend Setup

1. Clone the repository and navigate to the backend directory:

   ```bash
   git clone https://github.com/thundermage117/video-annotations
   cd video-annotations/backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up the PostgreSQL database:

   - Create the `video` and `annotation` tables in PostgreSQL.
   - Update the database connection details in `config.py`.

5. Run the Flask server:

   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install the required Node.js packages:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

## Usage

1. **Select a Video:**
   - Choose a video from the dropdown menu.

2. **Annotate the Video:**
   - Click and drag on the video to create an annotation.
   - Use the annotation toolbar to select tags and colors.
   - Save the annotation by clicking the "Save Annotation" button.

3. **Manage Annotations:**
   - View and manage annotations in the list below the video.
   - Edit or delete annotations as needed.

4. **Upload New Videos:**
   - Use the upload form to add new videos to the system.

## API Endpoints

- `GET /videos` - Fetch the list of available videos.
- `GET /video_url/:id` - Get the URL of the selected video.
- `GET /annotations/:videoId` - Fetch annotations for the specified video.
- `POST /annotations/:videoId` - Save a new annotation for the specified video.
- `POST /upload` - Upload a new video file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

---
