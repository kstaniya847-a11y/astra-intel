current_document = {
    "filename": None,
    "pages": [],
    "summary": None
}


def save_document(filename, pages, summary):
    current_document["filename"] = filename
    current_document["pages"] = pages
    current_document["summary"] = summary


def get_document():
    return current_document