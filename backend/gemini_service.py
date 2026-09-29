import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

client = genai.Client(api_key=GEMINI_API_KEY)


def generate_summary(document_text: str) -> str:
    prompt = f"""
You are a document intelligence assistant for ASTRA INTEL.

Summarize the following document content concisely.

Rules:
- Use only the information provided in the document.
- Do not add outside information.
- Keep important technical terms.
- Organize the summary into clear points.
- If the document content is insufficient for a point, do not invent information.

DOCUMENT:
{document_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text


def answer_question(question: str, pages: list[dict]) -> dict:
    document_text = "\n\n".join(
        f"Page {page['page']}:\n{page['text']}"
        for page in pages
    )

    prompt = f"""
You are ASTRA INTEL, a document intelligence assistant.

Answer the user's question using ONLY the uploaded document.

STRICT RULES:
- Do not use outside knowledge.
- Do not make up information.
- If the answer is not supported by the document, say:
  "The answer is not available in the uploaded document."
- Give a concise and clear answer.
- Identify the page number or page numbers that support the answer.
- Only cite pages whose content actually supports the answer.

Return your response in exactly this format:

ANSWER:
<your answer>

PAGES:
<comma-separated page numbers>

UPLOADED DOCUMENT:
{document_text}

USER QUESTION:
{question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    response_text = response.text.strip()

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

            if any(
                page["page"] == page_number
                for page in pages
            ):
                cited_pages.append(page_number)

    return {
        "answer": answer,
        "pages": cited_pages
    }