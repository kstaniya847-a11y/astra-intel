import os
import re

from dotenv import load_dotenv
from google import genai


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"

MAX_PAGE_CHARS = 3000
MAX_RELEVANT_PAGES = 3
MAX_SUMMARY_CHARS = 30000


def generate_summary(document_text: str) -> str:
    # Limit the amount of text sent to Gemini.
    # This helps reduce token usage for large PDFs.
    limited_document = document_text[:MAX_SUMMARY_CHARS]

    prompt = f"""
You are a document intelligence assistant for ASTRA INTEL.

Summarize the following document content concisely.

Rules:
- Use only the information provided in the document.
- Do not add outside information.
- Keep important technical terms.
- Organize the summary into clear points.
- Do not invent information.
- Keep the summary concise.

DOCUMENT:
{limited_document}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return response.text.strip()

    except Exception as error:
        error_message = str(error)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            return (
                "AI quota has been reached for the moment. "
                "The PDF was uploaded and processed, but an AI summary "
                "could not be generated because the Gemini API quota "
                "has been exhausted."
            )

        if "503" in error_message or "UNAVAILABLE" in error_message:
            return (
                "The Gemini AI service is temporarily unavailable. "
                "Please try again later."
            )

        return (
            "The document was uploaded, but the AI summary could not "
            "be generated at this time."
        )


def find_relevant_pages(question: str, pages: list[dict]) -> list[dict]:
    """
    Find the most relevant pages using keyword matching.

    Common words are ignored so that important technical words
    have more influence on the result.
    """

    stop_words = {
        "what",
        "when",
        "where",
        "which",
        "who",
        "why",
        "how",
        "are",
        "is",
        "the",
        "and",
        "for",
        "from",
        "with",
        "this",
        "that",
        "these",
        "those",
        "about",
        "does",
        "can",
        "could",
        "would",
        "should",
        "tell",
        "give",
        "explain",
        "describe",
        "main",
        "some"
    }

    question_words = set(
        re.findall(
            r"\b[a-zA-Z0-9]{3,}\b",
            question.lower()
        )
    )

    question_words = question_words - stop_words

    if not question_words:
        return []

    scored_pages = []

    for page in pages:
        page_text = page["text"]
        lower_text = page_text.lower()

        score = 0

        for word in question_words:
            occurrences = lower_text.count(word)

            if occurrences > 0:
                score += min(occurrences, 5)

        if score > 0:
            # Limit the text from each page.
            limited_text = page_text[:MAX_PAGE_CHARS]

            scored_pages.append(
                {
                    "page": page["page"],
                    "text": limited_text,
                    "score": score
                }
            )

    scored_pages.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return scored_pages[:MAX_RELEVANT_PAGES]


def answer_question(question: str, pages: list[dict]) -> dict:
    relevant_pages = find_relevant_pages(
        question,
        pages
    )

    if not relevant_pages:
        return {
            "answer": "The answer is not available in the uploaded document.",
            "pages": []
        }

    relevant_document = "\n\n".join(
        f"Page {page['page']}:\n{page['text']}"
        for page in relevant_pages
    )

    available_page_numbers = [
        page["page"]
        for page in relevant_pages
    ]

    prompt = f"""
You are ASTRA INTEL, a document intelligence assistant.

Answer the user's question using ONLY the provided document pages.

STRICT RULES:
- Do not use outside knowledge.
- Do not make up information.
- If the provided pages do not contain enough information,
  say exactly:
  "The answer is not available in the uploaded document."
- Give a concise and clear answer.
- Cite only pages that actually support the answer.
- Do not cite pages that do not support the answer.

Available source pages:
{available_page_numbers}

Return your response in exactly this format:

ANSWER:
<your answer>

PAGES:
<comma-separated page numbers>

DOCUMENT PAGES:
{relevant_document}

USER QUESTION:
{question}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        response_text = response.text.strip()

    except Exception as error:
        error_message = str(error)

        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            return {
                "answer": (
                    "AI quota has been reached for the moment. "
                    "Please try again after the Gemini API quota resets."
                ),
                "pages": []
            }

        if "503" in error_message or "UNAVAILABLE" in error_message:
            return {
                "answer": (
                    "The Gemini AI service is temporarily unavailable. "
                    "Please try again later."
                ),
                "pages": []
            }

        return {
            "answer": (
                "The AI service could not process the question "
                "at this time."
            ),
            "pages": []
        }

    answer = response_text
    pages_text = ""

    if "PAGES:" in response_text:
        answer_part, pages_part = response_text.split(
            "PAGES:",
            1
        )

        answer = answer_part.replace(
            "ANSWER:",
            ""
        ).strip()

        pages_text = pages_part.strip()

    cited_pages = []

    for item in pages_text.split(","):
        item = item.strip()

        if item.isdigit():
            page_number = int(item)

            if page_number in available_page_numbers:
                cited_pages.append(page_number)

    cited_pages = list(dict.fromkeys(cited_pages))

    return {
        "answer": answer,
        "pages": cited_pages
    }