import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { streamAIContent } from "../utils/geminiApi";

const AIGeneratorModal = ({ isOpen, onClose, onAccept }) => {
    const [prompt, setPrompt] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const responseRef = useRef(null);

    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [aiResponse]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return alert("Please enter a prompt!");
        setLoading(true);
        setAiResponse("");

        try {
            let buffer = "";
            let timeoutId = null;

            await streamAIContent(prompt, (chunk) => {
                buffer += chunk;

                if (!timeoutId) {
                    timeoutId = setTimeout(() => {
                        setAiResponse((prev) => prev + buffer);
                        buffer = "";
                        timeoutId = null;
                    }, 100);
                }
            });
        } catch (err) {
            console.error(err);
            alert("Streaming failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-8 rounded-3xl shadow-2xl w-[95%] max-w-3xl relative border border-gray-700"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {/* Header */}
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-400 flex items-center justify-center gap-2">
                    🤖 Generate with AI
                </h2>

                {/* Prompt input */}
                <textarea
                    className="w-full bg-[#1f2937] text-gray-100 p-4 rounded-xl border border-gray-600 focus:ring focus:ring-blue-500 focus:outline-none placeholder-gray-400 resize-none"
                    rows="4"
                    placeholder="Describe what you want AI to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                {/* Generate button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`mt-5 w-full py-3 rounded-xl font-semibold transition-all ${loading
                            ? "bg-blue-800 text-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        }`}
                >
                    {loading ? "Generating..." : "✨ Generate Content"}
                </button>

                {/* Generated content */}
                {aiResponse && (
                    <div className="mt-6">
                        <label className="block mb-2 text-sm font-medium text-gray-400">
                            Generated Content:
                        </label>
                        <div
                            ref={responseRef}
                            className="w-full bg-[#111827] p-4 rounded-xl border border-gray-700 h-72 overflow-y-auto whitespace-pre-wrap text-gray-100 text-sm leading-relaxed shadow-inner"
                        >
                            {aiResponse}
                            {loading && (
                                <span className="animate-pulse text-blue-400 ml-1">▌</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition text-gray-200"
                    >
                        Cancel
                    </button>
                    {aiResponse && (
                        <button
                            onClick={() => {
                                onAccept(aiResponse);
                                onClose();
                            }}
                            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition text-white shadow-md"
                        >
                            Accept
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AIGeneratorModal;
