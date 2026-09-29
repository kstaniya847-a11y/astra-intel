from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from pdf_processor import extract_pages
from gemini_service import generate_summary, answer_question
from document_store import save_document, get_document


app = FastAPI(title="ASTRA INTEL API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {
        "message": "ASTRA INTEL backend is running"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    file_path = UPLOAD_DIR / file.filename

    content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    pages = extract_pages(str(file_path))

    document_text = "\n\n".join(
        f"Page {page['page']}:\n{page['text']}"
        for page in pages
    )

    summary = generate_summary(document_text)

    save_document(
        filename=file.filename,
        pages=pages,
        summary=summary
    )

    return {
        "message": "PDF uploaded and processed successfully",
        "filename": file.filename,
        "page_count": len(pages),
        "summary": summary,
        "pages": pages
    }


@app.post("/api/ask")
def ask_question(request: QuestionRequest):
    document = get_document()

    if not document["pages"]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF before asking a question."
        )

    result = answer_question(
        question=request.question,
        pages=document["pages"]
    )

    return {
        "question": request.question,
        "answer": result["answer"],
        "source_pages": result["pages"]
    }