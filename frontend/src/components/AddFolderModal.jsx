import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function AddFolderModal({ isOpen, onClose, onFolderAdded }) {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setFolderName(""); // Reset input when modal opens
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/folders`,
        { name: folderName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("Folder created:", response.data.data);

      onFolderAdded(response.data.data); // Pass new folder back
      onClose(); // Close modal immediately after adding
    } catch (error) {
      console.error("Error creating folder:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark overlay */}
          <motion.div
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          ></motion.div>

          {/* Modal box */}
          <motion.div
            className="relative bg-gray-900 text-white rounded-lg p-8 w-96 z-10 shadow-2xl"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Add New Folder</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Folder name"
                className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-700 rounded hover:bg-gray-600"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 bg-blue-500 rounded hover:bg-blue-600 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
