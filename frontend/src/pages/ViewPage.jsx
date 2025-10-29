import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import { TextStyle, FontFamily, Color } from "@tiptap/extension-text-style";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "../styles/TiptapEditor.module.css"; // use global css for styling

const ViewPage = () => {
    const [note, setNote] = useState(null);
    const [renderedContent, setRenderedContent] = useState("");
    const navigate = useNavigate();
    const { noteId: note_id } = useParams();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get(`http://localhost:3000/api/notes/${note_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const noteData = response.data.data;
                console.log("Fetched note data:", noteData);
                setNote(noteData);

                const html = generateHTML(JSON.parse(noteData.content), [
                    StarterKit.configure({ heading: false }),
                    Heading.configure({ levels: [1, 2, 3] }),
                    Underline,
                    TextAlign.configure({ types: ["heading", "paragraph", "listItem"] }),
                    Image.configure({ inline: false }),
                    Blockquote,
                    TextStyle,
                    Color,
                    FontFamily,
                ]);
                setRenderedContent(html);
                console.log("Generated HTML content:", html);
            } catch (err) {
                console.error("Failed to fetch note:", err);
            }
        };

        fetchNote();
    }, [note_id]);

    if (!note) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-400 text-lg">
                Loading note...
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-start py-16 px-6 md:px-10 bg-[#0b0b18] text-gray-100 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Subtle gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0e162b] via-[#0d1024] to-[#050510]"></div>

            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-10 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
                >
                    <FaArrowLeft size={18} />
                    <span className="text-sm">Back</span>
                </button>
            </div>

            {/* Note Content Wrapper */}
            <motion.div
                className="relative z-10 w-full max-w-4xl rounded-2xl bg-[#10162c]/60 border border-[#1e2b50]/40 shadow-2xl shadow-black/40 p-8 md:p-12 backdrop-blur-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Title */}

                {/* Metadata */}
                <div className="flex justify-between items-center text-sm text-gray-400 border-b border-gray-700/50 pb-4 mb-6">
                    <div className="text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight tracking-tight">
                        {note.title}
                    </div>
                    <span>🕒 {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : note.date}</span>
                </div>

                {/* Rendered Content */}
                <div
                    className="editor text-gray-200 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderedContent }}
                ></div>
            </motion.div>
        </motion.div>
    );
};

export default ViewPage;
