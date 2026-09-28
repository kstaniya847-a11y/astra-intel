from fastapi import FastAPI

app = FastAPI(title="ASTRA INTEL API")


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