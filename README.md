# ASTRA INTEL — AI-Powered Defence Document Intelligence System

## 1. Overview

ASTRA INTEL is an AI-powered document intelligence system designed to analyse defence and technology-related PDF documents.

The system allows users to:

- Upload a PDF document
- Extract text from the document page-by-page
- Generate a concise summary
- Ask questions about the uploaded document
- Receive answers based only on the uploaded document
- View the page numbers used as the source for each answer
- Detect when an answer is not available in the uploaded document

The project was developed for the ASTRA Software Team 3-Day Build Challenge 2026–27.

## 2. Problem Statement

### AI-Powered Defence Document Intelligence System

Defence and technology documents can be long and contain large amounts of technical information. Manually searching through these documents to find specific information can be time-consuming.

ASTRA INTEL provides a simple interface where users can upload a document and interact with its contents using AI.

The main objective is to make document understanding faster while ensuring that the AI answers are grounded in the uploaded document.

## 3. Key Features

### PDF Upload

Users can upload a PDF document through the web interface.

### Page-Aware Text Extraction

The backend extracts text from every page while maintaining page numbers.

### AI Summary

After uploading a document, Gemini generates a concise summary using the document content.

### Document-Based Question Answering

Users can ask questions about the uploaded document.

The AI uses relevant pages from the document to generate the answer.

### Grounded Answers

The system instructs the AI to use only information from the uploaded document.

If the information is not available, the system responds:

"The answer is not available in the uploaded document."

### Source Page Citations

The system displays the page numbers used to answer the question.

### Multiple Questions

Users can ask multiple questions about the uploaded document during the same session.

### Error Handling

The system handles cases such as:

- Invalid file types
- Asking questions before uploading a document
- Gemini API quota errors
- Temporary AI service errors
- Unsupported questions

## 4. Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn

### PDF Processing

- pypdf

### AI

- Google Gemini API
- Gemini 2.5 Flash

### Environment Management

- python-dotenv

### Version Control

- Git
- GitHub

## 5. System Architecture

                    ┌──────────────────────┐
                    │        User          │
                    │                      │
                    │ Upload PDF / Ask Q&A │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Next.js Frontend   │
                    │                      │
                    │ PDF Upload           │
                    │ Summary              │
                    │ Question & Answer    │
                    │ Source Citations     │
                    └──────────┬───────────┘
                               │
                         HTTP Requests
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    │                      │
                    │ PDF Upload           │
                    │ Text Extraction      │
                    │ Document Storage     │
                    │ Retrieval            │
                    │ AI Processing        │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
          ┌──────────────────┐   ┌──────────────────┐
          │   PDF Processor  │   │    Gemini AI     │
          │                  │   │                  │
          │     pypdf        │   │ Gemini 2.5 Flash │
          │ Page Extraction  │   │                  │
          └──────────────────┘   └──────────────────┘

## 6. Data Flow

1. User uploads a PDF.
2. Next.js frontend sends the PDF to FastAPI.
3. FastAPI receives and saves the PDF.
4. pypdf extracts text from every page.
5. The extracted pages are stored with their page numbers.
6. Gemini generates a concise document summary.
7. The summary is returned to the frontend.
8. The user asks a question.
9. The backend searches for relevant pages.
10. Relevant pages are sent to Gemini.
11. Gemini generates an answer using only the provided document content.
12. The backend returns the answer and source page numbers.
13. The frontend displays the answer and citations.

## 7. AI Pipeline

The AI processing pipeline works as follows:

PDF
↓
Text Extraction
↓
Page-wise Document Representation
↓
Relevant Page Retrieval
↓
Prompt Construction
↓
Gemini 2.5 Flash
↓
Grounded Answer
↓
Page Citation

### Summary Generation

When a PDF is uploaded:

1. The PDF is received by FastAPI.
2. Text is extracted from each page.
3. The extracted content is combined into a document representation.
4. The document content is sent to Gemini.
5. Gemini generates a concise summary.
6. The summary is returned to the frontend.

### Question Answering

When a user asks a question:

1. The backend receives the question.
2. The system searches the uploaded pages for relevant keywords.
3. The most relevant pages are selected.
4. These pages are provided to Gemini.
5. Gemini is instructed to answer only using the provided pages.
6. The answer is returned.
7. The source page numbers are displayed.

## 8. Grounding and Hallucination Control

ASTRA INTEL is designed to reduce unsupported AI responses.

The AI prompt contains strict instructions:

- Use only the provided document.
- Do not use outside knowledge.
- Do not invent information.
- If sufficient information is unavailable, state that the answer is not available in the uploaded document.
- Cite only the provided source pages.

For example, if the uploaded document discusses Electronic Warfare and the user asks:

What is the capital of France?

The system should respond:

The answer is not available in the uploaded document.

This demonstrates document-grounded question answering.

## 9. Sample Documents

The project can be tested using defence and technology-related PDF documents.

Example documents include:

- Unmanned Aerial Vehicle
- Electronic Warfare
- Unmanned Ground Vehicle

These documents contain technical information related to defence technologies.

## 10. Project Structure

astra-intel/
│
├── backend/
│   ├── main.py
│   ├── pdf_processor.py
│   ├── gemini_service.py
│   ├── document_store.py
│   ├── .env
│   ├── .gitignore
│   └── uploads/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── package.json
│   └── ...
│
├── sample-documents/
│   ├── unmanned-aerial-vehicle-overview.pdf
│   ├── defence-electronics-electronic-warfare.pdf
│   └── unmanned-ground-vehicle.pdf
│
├── README.md
└── ...

## 11. Backend Setup

Open PowerShell and navigate to the backend:

    cd C:\Users\hp\Desktop\astra-intel\backend

Create the virtual environment:

    python -m venv venv

Activate it:

    .\venv\Scripts\Activate.ps1

Install the required packages:

    pip install fastapi uvicorn pypdf python-multipart

Install Gemini dependencies:

    pip install google-genai python-dotenv

## 12. Gemini API Configuration

Create a .env file inside:

    C:\Users\hp\Desktop\astra-intel\backend\.env

Add:

    GEMINI_API_KEY=YOUR_GEMINI_API_KEY

The API key should remain private and must not be uploaded to GitHub.

The .gitignore file contains:

    uploads/
    venv/
    __pycache__/
    .env

## 13. Running the Backend

From the backend directory:

    .\venv\Scripts\Activate.ps1

Run:

    uvicorn main:app --reload

The backend will run at:

    http://127.0.0.1:8000

FastAPI documentation is available at:

    http://127.0.0.1:8000/docs

Health check:

    http://127.0.0.1:8000/api/health

Expected response:

    {
      "status": "healthy"
    }

## 14. Frontend Setup

Open another PowerShell terminal.

Navigate to:

    cd C:\Users\hp\Desktop\astra-intel\frontend

Install dependencies:

    npm install

Run the development server:

    npm run dev

The frontend will run at:

    http://localhost:3000

## 15. How to Use the Application

### Step 1 — Start Backend

Run:

    cd C:\Users\hp\Desktop\astra-intel\backend
    .\venv\Scripts\Activate.ps1
    uvicorn main:app --reload

### Step 2 — Start Frontend

Open another terminal:

    cd C:\Users\hp\Desktop\astra-intel\frontend
    npm run dev

### Step 3 — Open the Application

Open:

    http://localhost:3000

### Step 4 — Upload a PDF

Select a defence-related PDF from your computer.

The frontend sends the PDF to the FastAPI backend.

### Step 5 — PDF Processing

The backend:

1. Saves the uploaded PDF.
2. Extracts text using pypdf.
3. Keeps the page numbers.
4. Generates an AI summary.

### Step 6 — Read the Summary

The generated summary is displayed in the interface.

### Step 7 — Ask a Question

Enter a question related to the uploaded document.

Example:

    What is an unmanned aerial vehicle?

### Step 8 — Receive the Answer

The system retrieves relevant pages and sends them to Gemini.

The answer is displayed along with source page numbers.

### Step 9 — Test Grounding

Ask a question unrelated to the uploaded document.

Example:

    What is the capital of France?

The system should respond:

    The answer is not available in the uploaded document.

## 16. API Endpoints

### Root Endpoint

GET /

Returns a message confirming that the backend is running.

### Health Endpoint

GET /api/health

Returns the backend health status.

### Upload Endpoint

POST /api/upload

The endpoint:

1. Receives the PDF.
2. Validates the file type.
3. Saves the file.
4. Extracts page-wise text.
5. Generates a summary.
6. Stores the document.
7. Returns the processed information.

### Ask Endpoint

POST /api/ask

Example request:

    {
      "question": "What is electronic warfare?"
    }

Example response:

    {
      "question": "What is electronic warfare?",
      "answer": "Answer based on the uploaded document...",
      "source_pages": [1, 2]
    }

## 17. Testing

The system was tested using different defence-related PDF documents.

### Electronic Warfare PDF

Example questions:

- What is electronic warfare?
- What are the main types of electronic warfare?
- What is jamming?
- What is electronic attack?
- What is electronic protection?
- What is electronic support?

The system returns answers with source pages.

### UAV PDF

Example questions:

- What is an unmanned aerial vehicle?
- What are the main applications of UAVs?
- How are UAVs classified?

The system returns answers based on the uploaded UAV document.

### UGV PDF

Example questions:

- What is an unmanned ground vehicle?
- What are the applications of UGVs?
- What are some examples of UGVs?
- What is the role of UGVs in EOD operations?

The system returns answers based on the uploaded UGV document.

### Unsupported Question Test

Question:

    What is the capital of France?

Expected result:

    The answer is not available in the uploaded document.

This test verifies that the system does not intentionally answer unrelated questions using outside information.

## 18. Error Handling

The backend handles several possible errors.

### Invalid File

Only PDF files are accepted.

If another file type is uploaded, the backend returns an error.

### No Document Uploaded

If the user asks a question before uploading a document, the backend returns:

    Please upload a PDF before asking a question.

### Gemini API Quota

If the Gemini API quota is exhausted, the system displays a user-friendly message instead of crashing.

### Gemini Service Unavailable

If Gemini is temporarily unavailable, the system informs the user that the AI service is temporarily unavailable.

## 19. Limitations

The current version has some limitations:

- Only one document is stored at a time.
- Document data is stored in memory.
- The document store resets when the backend restarts.
- Retrieval currently uses keyword-based matching.
- Very large documents may require more efficient processing.
- OCR is not currently implemented for scanned PDFs.
- Persistent chat history is not implemented in the backend.
- Semantic/vector search is not currently implemented.
- Gemini API usage depends on API availability and quota.

## 20. Future Enhancements

Possible future improvements include:

- Multiple document support
- Semantic search using embeddings
- Vector database integration
- Persistent document storage
- Persistent conversation history
- OCR for scanned PDFs
- Document comparison
- Better unsupported-answer detection
- Improved document chunking
- Advanced source highlighting
- Local/open-source AI models
- Authentication and user accounts
- Cloud deployment
- Larger document support

## 21. Security Considerations

The Gemini API key is stored in an environment file and should not be committed to GitHub.

The .env file is included in .gitignore.

Uploaded documents are processed by the backend and are not intended to be publicly exposed.

For a production deployment, additional security measures such as authentication, access control, file-size limits, validation, secure storage, and HTTPS should be implemented.

## 22. AI Usage

AI tools were used during development for:

- Understanding the problem statement
- Planning the application architecture
- Generating and improving code
- Debugging errors
- Designing prompts
- Improving document-grounded question answering
- Testing edge cases
- Writing documentation

The implementation was reviewed and tested during development.

Gemini 2.5 Flash is used by the application for:

- Document summarization
- Question answering

The system provides relevant document content to Gemini and instructs the model to answer only from the provided content.

## 23. Technical Decisions

### Why FastAPI?

FastAPI provides a lightweight Python backend suitable for building APIs for PDF processing and AI integration.

### Why Next.js?

Next.js provides a modern React-based frontend for creating the document upload and question-answering interface.

### Why pypdf?

pypdf provides straightforward extraction of text from PDF files while allowing page-by-page processing.

### Why Gemini?

Gemini provides the AI capabilities required for summarization and document-based question answering.

### Why Page-Based Processing?

Keeping page numbers during extraction allows the system to provide source-page citations with answers.

## 24. Project Workflow

The complete workflow of ASTRA INTEL is:

    User
      ↓
    Upload PDF
      ↓
    Next.js Frontend
      ↓
    FastAPI Backend
      ↓
    PDF Text Extraction
      ↓
    Page-wise Storage
      ↓
    Relevant Page Retrieval
      ↓
    Gemini AI
      ↓
    Grounded Answer
      ↓
    Source Page Identification
      ↓
    Frontend
      ↓
    Answer + Source Pages

## 25. Current Project Status

The current MVP supports:

- PDF upload
- PDF text extraction
- Page-aware processing
- AI summarization
- Document-based question answering
- Relevant page retrieval
- Source page citations
- Multiple questions
- Unsupported-question handling
- API error handling
- Next.js frontend
- FastAPI backend
- Gemini integration

The main focus is reliability, testing, documentation, and preparing the project for demonstration.

## 26. Conclusion

ASTRA INTEL demonstrates how AI can be used to make long defence and technology documents easier to understand and search.

Instead of requiring users to manually read an entire document, the system provides:

    Upload Document
          ↓
    Extract Information
          ↓
    Generate Summary
          ↓
    Ask Questions
          ↓
    Retrieve Relevant Content
          ↓
    Generate Grounded Answer
          ↓
    Show Source Pages

The project focuses on useful document intelligence while maintaining document-grounded responses and source traceability.