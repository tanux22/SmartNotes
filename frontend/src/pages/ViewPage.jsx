import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { generateHTML } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import { TextStyle, FontFamily, Color } from "@tiptap/extension-text-style";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "../styles/TiptapEditor.module.css";
import { Image } from "../components/tiptap-node/image-node/image-node-extension";

const ViewPage = () => {
  const [note, setNote] = useState(null);
  const [renderedContent, setRenderedContent] = useState("");
  const navigate = useNavigate();
  const { noteId: note_id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:3000/api/notes/${note_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const noteData = response.data.data;
        setNote(noteData);

        const jsonContent = JSON.parse(noteData.content);
        const html = generateHTML(jsonContent, [
          StarterKit.configure({ heading: false }),
          Heading.configure({ levels: [1, 2, 3] }),
          Underline,
          TextAlign.configure({
            types: ["heading", "paragraph", "listItem", "image"],
          }),
          Blockquote,
          TextStyle,
          Color,
          FontFamily,
          Image,
        ]);

        // ✅ Fix image alignment dynamically
        const fixedHtml = html.replace(
          /<img([^>]+)>/g,
          (match, attrs) => {
            const dataAlignMatch = attrs.match(
              /data-align=["']?(left|center|right)["']?/
            );
            const align = dataAlignMatch ? dataAlignMatch[1] : "center";

            let marginStyle = "";
            if (align === "left")
              marginStyle = "display:block;margin-left:0;margin-right:auto;";
            else if (align === "right")
              marginStyle = "display:block;margin-left:auto;margin-right:0;";
            else
              marginStyle =
                "display:block;margin-left:auto;margin-right:auto;";

            // safely merge existing styles
            if (attrs.includes("style=")) {
              return `<img${attrs.replace(
                /style=["']([^"']*)["']/,
                (s, existing) => `style="${existing} ${marginStyle}"`
              )}>`;
            } else {
              return `<img${attrs} style="${marginStyle}">`;
            }
          }
        );

        setRenderedContent(fixedHtml);
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
    <>
      <motion.div
        className="min-h-screen flex flex-col items-start justify-start px-4 sm:px-6 md:px-10 bg-[#0b0b18] text-gray-100 relative overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0e162b] via-[#0d1024] to-[#050510]" />

        {/* Back button */}
        <div className="w-full max-w-9xl position mx-auto flex items-start justify-start pt-20 sm:pt-12 md:pt-20 mb-6 md:mb-10 z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition text-sm sm:text-base"
          >
            <FaArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {/* Note container */}
        <motion.div
          className="relative z-10 w-full max-w-9xl mx-auto rounded-2xl bg-[#000000]/90 border border-[#1e2b50] shadow-2xl shadow-black/50 p-6 sm:p-8 md:p-10 lg:p-12 backdrop-blur-xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Metadata / Title */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-sm text-gray-400 border-b border-gray-500 pb-3 sm:pb-4 mb-6 gap-2 sm:gap-0">
            <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight tracking-tight break-words">
              {note.title}
            </div>
            <span className="text-xs sm:text-sm">
              🕒{" "}
              {note.updatedAt
                ? new Date(note.updatedAt).toLocaleString()
                : note.date}
            </span>
          </div>

          {/* Rendered Content */}
          <div
            className="editor text-gray-200 leading-relaxed prose prose-invert max-w-none text-[15px] sm:text-base md:text-lg break-words"
            dangerouslySetInnerHTML={{ __html: renderedContent }}
          ></div>
        </motion.div>

        {/* Bottom padding for mobile safe area */}
        <div className="h-10" />
      </motion.div>
    </>
  );
};

export default ViewPage;
