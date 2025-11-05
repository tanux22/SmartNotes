import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NotesHeader from "../components/NotesHeader";
import NoteCard from "../components/NoteCard";
import { MdAdd } from "react-icons/md";
import axios from "axios";
import { use } from "react";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState({ _id: "All", name: "All" });
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (folders.length > 0) fetchNotes();
  }, [folders]);

  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/folders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = response.data.data;
      console.log("Fetched folders:", data);
      setFolders([{ _id: "All", name: "All" }, ...data.map(folder => ({ _id: folder._id, name: folder.name }))]);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = response.data.data;
      console.log("Raw fetched notes:", data);

      const formattedNotes = data.map(note => ({
        id: note.id,
        folder: note.folder || "Uncategorized",
        title: note.title,
        content: note.content,
        date: note.date,
      }));

      console.log("Fetched notes:", formattedNotes);
      setNotes(formattedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      // When search active, only show ranked search results
      const rankedIds = searchResults.map((r) => r.id);
      const matchedNotes = notes.filter((n) => rankedIds.includes(n.id));
      // Sort by score order
      matchedNotes.sort(
        (a, b) =>
          searchResults.find((r) => r.id === b.id)?.score -
          searchResults.find((r) => r.id === a.id)?.score
      );
      setFilteredNotes(matchedNotes);
    } else {
      // Otherwise show by folder
      setFilteredNotes(
        selectedFolder.name === "All"
          ? notes
          : notes.filter((n) => n.folder === selectedFolder.name)
      );
    }
  }, [searchResults, searchQuery, selectedFolder, notes]);

  const handleDelete = async (id) => {
    try {
      setNotes(notes.filter((n) => n.id !== id));
      const response = await axios.delete(`http://localhost:3000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleAddNote = () => {
    navigate(`/create-note/${selectedFolder._id}`);
    const newNote = {
      id: Date.now(),
      folder: selectedFolder.name === "All" ? "Personal" : selectedFolder.name,
      title: "New Note",
      content: "Start writing your note...",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setNotes([newNote, ...notes]);
  };

  const handleFolderAdded = (newFolder) => {
    setFolders((prevFolders) => {
      // Keep "All" at the top
      const allFolder = prevFolders.find(f => f.name === "All");
      const otherFolders = prevFolders.filter(f => f.name !== "All");

      setSelectedFolder({ _id: newFolder._id, name: newFolder.name }); // Select the newly added folder

      return [
        allFolder, // always first
        { _id: newFolder._id, name: newFolder.name }, // append new folder at the end
        ...otherFolders
      ];
    });
  };



  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden text-white">
      {/* 🌌 Subtle Dark Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          background: [
            "radial-gradient(circle at 25% 25%, #111526 5%, #000000 95%)",
            "radial-gradient(circle at 75% 75%, #0e1422 5%, #000000 95%)"
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar (Folder list) */}
        <Sidebar
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onFolderAdded={handleFolderAdded}
          refreshFolders={fetchFolders}
        />

        <main className="flex-1 p-6 pt-20 overflow-y-auto custom-scrollbar relative">
          <NotesHeader
            total={notes.length}
            folderCount={filteredNotes.length}
            selectedFolder={selectedFolder}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchResults={setSearchResults}
          />

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>

          {/* ➕ Floating Add Note Button */}
          {selectedFolder.name !== "All" && (
            <motion.button
              onClick={handleAddNote}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-cyan-400 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 text-white rounded-full p-4 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <MdAdd size={28} />
            </motion.button>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
