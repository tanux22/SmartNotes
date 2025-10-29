// // src/Tiptap.tsx
// import { useEditor, EditorContent } from '@tiptap/react'
// import StarterKit from '@tiptap/starter-kit'


// const extensions = [
//     StarterKit,
// ]
// const content = `<p>Hello World!</p>`;

// const Tiptap = () => {


//     const editor = useEditor({
//         extensions: extensions,
//         content: content,
//     })

//     if (!editor) {
//         return null;
//     }




//     return (
//         <div className="p-25">
//             <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}>
//                 Bold
//             </button>
//             <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}>
//                 Italic
//             </button>
//             <button onClick={() => editor.chain().focus().toggleUnderline().run()} disabled={!editor.can().chain().focus().toggleUnderline().run()}>
//                 Underline
//             </button>
//             <EditorContent editor={editor} />
//         </div>
//     )
// }

// export default Tiptap;


import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
    FaArrowLeft,
    FaSave,
    FaMagic,
    FaBold,
    FaItalic,
    FaUnderline,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaListUl,
    FaQuoteLeft,
    FaCode,
    FaImage,
} from "react-icons/fa";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";


export default function Tiptap({ onSave }) {
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState("Just now");
    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const navigate = useNavigate();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
        ],

        content: "<p>Start writing your note here...</p>",

        onUpdate: ({ editor }) => {
            const text = editor.getText();
            setCharCount(text.length);
            setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
        },
    });

    if (!editor) return;



    const handleSave = async () => {

        setSaving(true);
        try {
            const content = editor.getJSON();
            await onSave?.({ title, content });
            setLastSaved(new Date().toLocaleTimeString());
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen pt-20 px-10 py-10 bg-gradient-to-br from-[#050510] via-[#0c0c1f] to-[#131336] text-gray-100 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Subtle gradient glow */}
            <motion.div
                className="absolute w-[30rem] h-[30rem] rounded-full bg-blue-600/20 blur-[180px] top-[-10%] left-[-10%] pointer-events-none"
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-[25rem] h-[25rem] rounded-full bg-purple-600/20 blur-[150px] bottom-[-10%] right-[-10%] pointer-events-none"
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
                transition={{ duration: 12, repeat: Infinity }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-10 relative z-10">
                <motion.div
                    className="flex items-center gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <button className="text-gray-400 hover:text-blue-400 transition">
                        <FaArrowLeft size={20} onClick={() => navigate("/")} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-wide">
                            Create New Note
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Write, format, and style your ideas beautifully
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="flex items-center gap-4 "
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-500 text-white rounded-xl hover:brightness-110 transition shadow-lg shadow-fuchsia-600/40"
                    >
                        <FaMagic /> Generate using AI
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-xl hover:brightness-110 transition shadow-lg shadow-blue-600/40"
                    >
                        <FaSave /> {saving ? "Saving..." : "Save Note"}
                    </button>
                </motion.div>
            </div>

            {/* Title */}
            <motion.input
                type="text"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[30px] font-bold bg-transparent border-b border-blue-500/40 outline-none focus:border-blue-400 transition duration-300 pb-3 mb-8 placeholder-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            />

            {/* Toolbar (just for styling) */}
            <div className="flex items-center gap-3 bg-[#0e1a2b]/70 border border-blue-500/20 rounded-xl px-4 py-3 mb-4 backdrop-blur-xl shadow-md shadow-blue-900/10">
                {[FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaListUl, FaQuoteLeft, FaCode, FaImage].map((Icon, i) => (
                    <button
                        key={i}
                        className="p-2 rounded-md hover:bg-blue-600/20 text-gray-300 hover:text-white transition"
                    >
                        <Icon size={16} />
                    </button>
                ))}
            </div>

            {/* Editor */}
            <motion.div
                className="bg-[#0e1a2b]/60  backdrop-blur-2xl border border-blue-500/20 rounded-2xl shadow-lg overflow-hidden p-5 text-white min-h-[550px] prose prose-invert"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                {editor ? (
                    <EditorContent editor={editor} />
                ) : (
                    <p className="text-gray-400 italic">Loading editor...</p>
                )}
            </motion.div>

            {/* Footer */}
            <motion.div
                className="flex justify-between text-sm text-gray-400 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <p>
                    {charCount} characters · {wordCount} words
                </p>
                <p>Last saved: {lastSaved}</p>
            </motion.div>
        </motion.div>
    );
}
