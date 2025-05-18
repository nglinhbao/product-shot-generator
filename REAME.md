# Product Shot Generator

A web application that transforms ordinary product images into professional marketing shots using Stable Diffusion API.

## Features

- **Image Upload**: Upload product images for transformation.
- **Custom Prompts**: Specify desired style, background, and other details with text prompts.
- **Aspect Ratios**: Choose from multiple aspect ratios for your generated images.
- **Real-time Updates**: View progress updates in real-time while the image is being generated.
- **High-Quality Output**: Download high-resolution, professionally generated images.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Image Processing**: Stable Diffusion API, Pillow

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following setup on your system:

- **Python**: Install Python 3.9 or higher.
- **Node.js**: Install Node.js (v18 or higher) and npm.
- **Stable Diffusion API Key**: Obtain your API key from [Stable Diffusion](https://modelslab.com).

### Configuration

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/nglinhbao/product-shot-generator
   cd product-shot-generator
   ```

2. **Set Up Environment Variables**:

   Create a `.env` file in the `backend` directory and populate it with the following environment variables:

   ```env
   STABLE_DIFFUSION_API_KEY=your_stable_diffusion_api_key
   ```

### Backend Setup

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI server:

   ```bash
   python main.py
   ```

   The backend API will be accessible at `http://localhost:8000`.

### Frontend Setup

1. Open a new terminal window and navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install npm dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be accessible at `http://localhost:5173`.

### Workflow

1. Open the web application at `http://localhost:5173`.
2. Upload your product image and specify the desired style or background using a text prompt.
3. Select the aspect ratio for your output image.
4. Click "Generate" and view the progress updates in real time.
5. Download your professionally generated product shot.

---

## API Endpoints

### `/api/generate` (POST)

- **Description**: Generate a professional product shot based on an uploaded image and user-defined prompt.
- **Parameters**:
  - `image` (file): The product image to be transformed.
  - `prompt` (string): A text description of the desired style and background.
  - `aspect_ratio` (string): The aspect ratio of the generated image (default: `512`).
- **Response**:
  - `success` (boolean): Indicates whether the request was successful.
  - `image_url` (string): The URL of the generated image.
  - `file_path` (string): The absolute path of the generated image file.

### `/images/{filename}` (GET)

- **Description**: Retrieve a generated image by filename.
- **Parameters**:
  - `filename` (string): The name of the file to retrieve.
- **Response**: Returns the image file.