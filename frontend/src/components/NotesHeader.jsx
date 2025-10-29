import React from "react";
import { motion } from "framer-motion";
import { MdOutlineLibraryBooks } from "react-icons/md";

export default function NotesHeader({ total, folderCount, selectedFolder, searchQuery, setSearchQuery }) {
  return (
    <motion.div
      className="flex items-center justify-between bg-[#1b1b2f] p-5 rounded-2xl shadow-md border border-white/10 backdrop-blur-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left Info */}
      <div className="flex items-center gap-3">
        <MdOutlineLibraryBooks size={30} className="text-purple-400" />
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            {selectedFolder.name === "All" ? "All Notes" : `${selectedFolder.name} Notes`}
          </h2>
          <p className="text-gray-400 text-sm">
            {selectedFolder.name === "All"
              ? `Total Notes: ${total}`
              : `Folder Notes: ${folderCount} / ${total}`}
          </p>
        </div>
      </div>

      {/* Right Search Bar */}
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1b1b2f] text-white placeholder-gray-400 rounded-full px-4 py-2 border-1 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-[0_0_8px_rgba(0,191,255,0.6)]"
        />
      </div>
    </motion.div>
  );
}
