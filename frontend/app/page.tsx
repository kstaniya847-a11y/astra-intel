"use client";

import { useState } from "react";

type Message = {
  question: string;
  answer: string;
  pages: number[];
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [summary, setSummary] = useState("");

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    setUploading(true);
    setError("");
    setSummary("");
    setMessages([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      setFilename(data.filename);
      setPageCount(data.page_count);
      setSummary(data.summary);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      return;
    }

    setAsking(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Question failed.");
      }

      setMessages((previous) => [
        ...previous,
        {
          question: question.trim(),
          answer: data.answer,
          pages: data.source_pages || [],
        },
      ]);

      setQuestion("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while asking the question."
      );
    } finally {
      setAsking(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold">
                AI
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  ASTRA INTEL
                </h1>

                <p className="text-xs text-slate-400">
                  Defence Document Intelligence
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            System Online
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Introduction */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-blue-400">
            AI Document Analysis Platform
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Analyse defence documents with grounded AI
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            Upload a defence document, generate a concise summary, and ask
            questions using information from the uploaded document.
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-1">
            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-400">
                STEP 01
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Upload Document
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Upload a PDF document for AI-powered analysis.
              </p>
            </div>

            <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-950/50 px-5 text-center transition hover:border-blue-500 hover:bg-slate-950">
              <div className="mb-3 text-4xl">↑</div>

              <p className="font-medium">
                {file ? file.name : "Select a PDF"}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                PDF documents only
              </p>

              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] || null;
                  setFile(selectedFile);
                  setError("");
                }}
              />
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {uploading ? "Processing..." : "Analyse Document"}
            </button>

            {filename && (
              <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Current Document
                </p>

                <p className="mt-2 truncate text-sm font-medium">
                  {filename}
                </p>

                {pageCount !== null && (
                  <p className="mt-1 text-xs text-slate-400">
                    {pageCount} pages processed
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Summary */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-400">
                STEP 02
              </p>

              <h3 className="mt-1 text-xl font-semibold">
                Intelligence Summary
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                AI-generated summary based on the uploaded document.
              </p>
            </div>

            {summary ? (
              <div className="max-h-[520px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {summary}
                </p>
              </div>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 text-center">
                <div>
                  <div className="text-4xl">◈</div>

                  <p className="mt-3 font-medium text-slate-300">
                    No document analysed yet
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Upload a PDF to generate intelligence.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Q&A */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5">
            <p className="text-sm font-semibold text-blue-400">
              STEP 03
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              Ask the Document
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Ask questions and receive answers grounded in the uploaded
              document.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !asking) {
                  handleAsk();
                }
              }}
              placeholder="Ask a question about the uploaded document..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />

            <button
              onClick={handleAsk}
              disabled={asking || !question.trim()}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {asking ? "Thinking..." : "Ask"}
            </button>
          </div>

          {/* Conversation */}
          <div className="mt-6 space-y-5">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-sm text-slate-500">
                Your document questions and answers will appear here.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className="space-y-3"
                >
                  {/* Question */}
                  <div className="ml-auto max-w-3xl rounded-xl bg-blue-600/20 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Your Question
                    </p>

                    <p className="mt-2 text-sm text-slate-200">
                      {message.question}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="max-w-4xl rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      ASTRA INTEL
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                      {message.answer}
                    </p>

                    {/* Sources */}
                    {message.pages.length > 0 && (
                      <div className="mt-5 border-t border-slate-800 pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Source Pages
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {message.pages.map((page) => (
                            <span
                              key={page}
                              className="rounded-full border border-blue-800 bg-blue-950/50 px-3 py-1 text-xs font-medium text-blue-300"
                            >
                              Page {page}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          ASTRA INTEL · AI-Powered Defence Document Intelligence System
        </footer>
      </div>
    </main>
  );
}