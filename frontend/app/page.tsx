"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch(() => {
        setStatus("Backend connection failed");
      });
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="rounded-xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold">
          ASTRA INTEL
        </h1>

        <p className="mt-2 text-gray-600">
          AI-Powered Defence Document Intelligence System
        </p>

        <div className="mt-6">
          <p className="font-semibold">
            Backend Status:
          </p>

          <p className="mt-2 text-green-600">
            {status}
          </p>
        </div>
      </div>
    </main>
  );
}