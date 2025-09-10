"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Loader2 } from "lucide-react";
import { useAuthStore } from "../../../store/authStore"; // adjust path if needed
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIStudyCompanionPage = () => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [latency, setLatency] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { messages, sendChat, loading } = useAuthStore();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    const startTime = performance.now(); // start timing
    await sendChat(input, file);
    const endTime = performance.now(); // end timing
    setLatency(((endTime - startTime) / 1000).toFixed(2)); // in seconds

    setInput("");
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col h-screen">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <p className="text-[24px] sm:text-[30px] font-semibold text-blue-600">
          AI Study Companion
        </p>
        <p className="text-gray-500 text-[13px] sm:text-[14px]">
          Smart help when you need it, 24/7.
        </p>
      </div>

      {/* Messages */}
      <div className="flex flex-col flex-1 mt-6 sm:mt-10 w-full max-w-2xl mx-auto overflow-y-auto border rounded-lg p-3 sm:p-4 bg-gray-50">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "user" ? (
                <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm max-w-[85%] break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="bg-white border shadow px-4 py-2 rounded-xl text-sm text-left max-w-[85%] sm:max-w-[70%] w-fit break-words">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">
            Start the conversation by asking something...
          </p>
        )}

        {loading && (
          <div className="mr-auto bg-gray-200 text-gray-800 p-3 rounded-xl flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Thinking...
          </div>
        )}

        {/* Auto scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="flex justify-center w-full mt-4">
        <div className="bg-white shadow rounded-full flex items-center gap-3 px-4 py-2 w-full max-w-2xl">
          <button className="text-gray-500 hover:text-blue-600">
            <Mic size={22} />
          </button>

          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 border-none outline-none p-3 text-gray-700 text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            className={`text-gray-500 hover:text-blue-600 ${
              file ? "text-blue-600" : ""
            }`}
            onClick={() => fileInputRef.current.click()}
          >
            <Paperclip size={22} />
          </button>

          {/* Send Button */}
          <button
            className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Show selected file preview */}
      {file && (
        <div className="max-w-2xl mx-auto mt-2 text-sm text-gray-600 flex items-center gap-2">
          <span>{file.name}</span>
          <button
            className="text-red-500 hover:underline text-xs"
            onClick={() => setFile(null)}
          >
            Remove
          </button>
        </div>
      )}

      {/* Latency Display */}
      {latency && (
        <div className="max-w-2xl mx-auto mt-2 text-xs text-gray-500 text-center">
          {latency} 
        </div>
      )}
    </div>
  );
};

export default AIStudyCompanionPage;
