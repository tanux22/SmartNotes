import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const handleEdit = () => navigate(`/edit-note/${note.id}`);
  const handleView = () => navigate(`/view-note/${note.id}`);

  useEffect(() => {
    try {
      if (note.content?.trim().startsWith("{")) {
        const parsed = JSON.parse(note.content);

        // Recursive function to find first text node
        const extractFirstText = (node) => {
          if (!node) return "";
          if (Array.isArray(node)) {
            for (const child of node) {
              const text = extractFirstText(child);
              if (text) return text;
            }
          } else if (node.type === "text" && node.text) {
            return node.text;
          } else if (node.content) {
            return extractFirstText(node.content);
          }
          return "";
        };

        const firstText = extractFirstText(parsed.content);
        setText(firstText || "(Empty note)");
      } else {
        setText(note.content);
      }
    } catch (err) {
      console.error("Error parsing note content:", err);
      setText(note.content);
    }
  }, [note.content]);

  return (
    <motion.div
      className="bg-[#1c1c2f] p-5 rounded-2xl shadow-md border border-white/10 
      hover:border-purple-500/30 hover:shadow-purple-600/20 transition-all duration-300 relative"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header (Title + Actions) */}
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white">{note.title}</h3>
        <div className="flex gap-2">
          {/* 👁 View Note Button */}
          <button
            onClick={handleView}
            className="text-gray-400 hover:text-green-400 transition-colors"
            title="View Note"
          >
            <FaEye size={20} />
          </button>

          {/* ✏️ Edit Note Button */}
          <button
            onClick={handleEdit}
            className="text-gray-400 hover:text-blue-400 transition-colors"
            title="Edit Note"
          >
            <MdEdit size={20} />
          </button>

          {/* 🗑 Delete Note Button */}
          <button
            onClick={() => onDelete(note.id)}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Delete Note"
          >
            <MdDeleteOutline size={20} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      <p className="text-gray-300 text-sm mt-3 line-clamp-3">{text}</p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <span>{note.date}</span>
        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-bold">
          {note.folder}
        </span>
      </div>
    </motion.div>
  );
}
