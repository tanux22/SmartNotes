import { motion } from "framer-motion";
import { FaStickyNote, FaPlus, FaCog, FaSignOutAlt, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AddFolderModal from "./AddFolderModal";
import { useState } from "react";
import axios from "axios";

export default function Sidebar({ folders, selectedFolder, onSelectFolder, onFolderAdded, refreshFolders }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState("");

  const handleDeleteFolder = async (folder) => {
    try {
      await axios.delete(`http://localhost:3000/api/folders/${folder._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      refreshFolders();
      if (selectedFolder.name === folder.name) onSelectFolder("All");
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleSaveEdit = async (folder) => {
    if (!editFolderName.trim()) return; // Don't allow empty names
    try {
      await axios.put(
        `http://localhost:3000/api/folders/${folder._id}`,
        { name: editFolderName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
      setEditingFolderId(null);
      setEditFolderName("");
      refreshFolders();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  return (
    <motion.aside
      className="relative w-64 h-screen flex flex-col justify-between p-5 pt-20 
                 border-r border-gray-800 bg-gradient-to-b from-[#0f0f1a] to-[#121220] 
                 text-gray-300 shadow-lg overflow-hidden"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.1),transparent_70%)] pointer-events-none"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Folder list */}
      <div className="relative z-10">
        <nav className="flex flex-col gap-2">
          <button disabled className="flex items-center w-full text-left px-4 py-2 rounded-lg text-gray-400 cursor-default select-none">
            <FaStickyNote className="mr-3 text-blue-400" /> Folders
          </button>

          {folders.map((folder, index) => (
            <motion.div
              key={folder._id || `folder-${index}`}
              className={`group flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer
                ${selectedFolder.name === folder.name
                  ? 'bg-purple-600/20 border-l-4 border-purple-500 text-white'
                  : 'hover:bg-purple-600/10 hover:text-white text-gray-300'
                }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => editingFolderId !== folder._id && onSelectFolder({ _id: folder._id, name: folder.name })}
            >
              <div className="flex items-center w-full">
                <MdOutlineLibraryBooks className="mr-3 text-blue-400" />

                {/* Inline edit input with only tick mark */}
                {editingFolderId === folder._id ? (
                  <div className="flex items-center flex-1 gap-2">
                    <input
                      type="text"
                      className="w-36 bg-gray-800 text-white rounded-md px-2 py-1 shadow-inner border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      value={editFolderName}
                      onChange={(e) => setEditFolderName(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveEdit(folder); }}
                      className="p-1 rounded hover:bg-green-600/30 transition"
                      title="Save"
                    >
                      <FaCheck size={16} className="text-green-400" />
                    </button>
                  </div>
                ) : (
                  <span className="flex-1">{folder.name}</span>
                )}
              </div>

              {/* Edit/Delete buttons */}
              {folder.name !== "All" && editingFolderId !== folder._id && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolderId(folder._id);
                      setEditFolderName(folder.name);
                    }}
                    className="p-1 rounded hover:bg-purple-600/30"
                    title="Edit Folder"
                  >
                    <FaEdit size={14} className="text-gray-300 hover:text-purple-400" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder);
                    }}
                    className="p-1 rounded hover:bg-red-600/30"
                    title="Delete Folder"
                  >
                    <FaTrash size={14} className="text-gray-300 hover:text-red-400" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10">
        <button
          className="flex items-center w-full text-left px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-medium hover:brightness-110 transition"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className="mr-2 text-black-700" /> New Folder
        </button>

        <AddFolderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFolderAdded={onFolderAdded}
        />

        <div className="flex flex-col gap-2 mt-6 border-t border-gray-700 pt-4">
          <button className="flex items-center gap-2 px-3 py-2 hover:text-blue-400 transition" onClick={() => navigate('/login')}>
            <FaSignOutAlt className="text-blue-400" /> Logout
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:text-blue-400 transition" onClick={() => navigate('/settings')}>
            <FaCog className="text-blue-400" /> Settings
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
