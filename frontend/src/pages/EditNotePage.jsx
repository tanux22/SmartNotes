import React, { use, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import {
  FaArrowLeft,
  FaSave,
  FaMagic,
  FaBold,
  FaUnderline,
  FaItalic,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaCode,
  FaParagraph,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaMinus,
  FaUndo,
  FaDownload,
  FaRedo,
  FaTrash,
  FaImage,
} from "react-icons/fa";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import styles from "../styles/TiptapEditor.module.css";
import Footer from "../components/Footer";
import Blockquote from "@tiptap/extension-blockquote";
import { Image } from "../components/tiptap-node/image-node/image-node-extension";
import { TextStyle, FontFamily, Color } from '@tiptap/extension-text-style'

export default function EditNotePage({ onSave }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState("Just now");
  const [charCount, setCharCount] = useState(0);
  const [imageWidth, setImageWidth] = useState(400);
  const [wordCount, setWordCount] = useState(0);
  const navigate = useNavigate();
  const { noteId: note_id } = useParams();
  const [note, setNote] = useState({});

  // Initialize TipTap Editor
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph", "listItem", "image"] }),
      Blockquote,
      TextStyle,
      Color,
      FontFamily,
      Image.configure({
        HTMLAttributes: {
          class: "custom-image-class",
        },
      }),
    ],
    content: "<p> Start writing your note here... </p>",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setCharCount(text.length);
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
    },
  });

  if (!editor) return null;

  useEffect(() => {
    fetchNote();
  }, [editor]);

  // Toolbar Actions
  const handleToolbarAction = (action, e) => {
    if (!editor) return;

    switch (action) {
      case "bold":
        editor.chain().focus().toggleBold().run();
        break;
      case "italic":
        editor.chain().focus().toggleItalic().run();
        break;
      case "strike":
        editor.chain().focus().toggleStrike().run();
        break;
      case "underline":
        editor.chain().focus().toggleUnderline().run();
        break;
      case "text-align-left":
        editor.chain().focus().setTextAlign('left').run();
        editor.chain().focus().updateAttributes("image", { dataAlign: "left" }).run();
        break;
      case "text-align-center":
        editor.chain().focus().setTextAlign('center').run();
        editor.chain().focus().updateAttributes("image", { dataAlign: "center" }).run();
        break;
      case "text-align-right":
        editor.chain().focus().setTextAlign('right').run();
        editor.chain().focus().updateAttributes("image", { dataAlign: "right" }).run();
        break;
      case "code":
        editor.chain().focus().toggleCode().run();
        break;
      case "paragraph":
        editor.chain().focus().setParagraph().run();
        break;
      case "h1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bullet-list":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "ordered-list":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "code-block":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "horizontal-rule":
        editor.chain().focus().setHorizontalRule().run();
        break;
      case "undo":
        editor.chain().focus().undo().run();
        break;
      case "redo":
        editor.chain().focus().redo().run();
        break;
      case "image":
        document.getElementById("imageUploadInput").click();
        break;
      case "delete-image":
        editor.chain().focus().deleteSelection().run();
        break;
      case "set-color":
        editor.chain().focus().setColor(e.currentTarget.value).run();
        break;
      case "set-font-family":
        editor.chain().focus().setFontFamily(`${e.target.value}`).run();
        break;
      case "download-image": {
        const { state } = editor;
        const node = state.selection.node;
        if (node && node.attrs.src) {
          const link = document.createElement("a");
          link.href = node.attrs.src;
          link.download = "image.jpg";
          link.click();
        }
        break;
      }
      default:
        break;
    }
  };

  const handleImageUpload = async (file) => {
    const uploadPreset = "Notes_Image_Handler";
    const cloudName = "dfxzehbmv";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const imageUrl = response.data.secure_url;
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          width: `${imageWidth}px`,
          dataAlign: "center",
        })
        .run();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const fetchNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://localhost:3000/api/notes/${note_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const note = response.data.data;
      console.log("Fetched note for editing:", note);
      setNote(note);
      setTitle(note.title);
      editor.commands.setContent(JSON.parse(note.content));
    } catch (err) {
      console.error("Failed to fetch note:", err);
    }
  };


  // Save Note
  const handleSave = async () => {
    setSaving(true);
    try {

      const content = JSON.stringify(editor.getJSON());

      const token = localStorage.getItem("accessToken");

      await axios.put(
        `http://localhost:3000/api/notes/${note_id}`,
        {
          title,
          content,
          folder_id: note.folder_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLastSaved(new Date().toLocaleTimeString());
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Toolbar Button Data
  const toolbarButtons = [
    { label: "Bold", action: "bold", icon: FaBold },
    { label: "Italic", action: "italic", icon: FaItalic },
    { label: "Underline", action: "underline", icon: FaUnderline },
    { label: "Strike", action: "strike", icon: FaStrikethrough },
    { label: "Text Align Left", action: "text-align-left", icon: FaAlignLeft },
    { label: "Text Align Center", action: "text-align-center", icon: FaAlignCenter },
    { label: "Text Align Right", action: "text-align-right", icon: FaAlignRight },
    { label: "Code", action: "code", icon: FaCode },
    { label: "Paragraph", action: "paragraph", icon: FaParagraph },
    { label: "H1", action: "h1" },
    { label: "H2", action: "h2" },
    { label: "H3", action: "h3" },
    { label: "Bullet List", action: "bullet-list", icon: FaListUl },
    { label: "Ordered List", action: "ordered-list", icon: FaListOl },
    { label: "Code Block", action: "code-block", icon: FaCode },
    { label: "Blockquote", action: "blockquote", icon: FaQuoteLeft },
    { label: "Horizontal Rule", action: "horizontal-rule", icon: FaMinus },
    { label: "Undo", action: "undo", icon: FaUndo },
    { label: "Redo", action: "redo", icon: FaRedo },
    { label: "Image", action: "image", icon: FaImage },
    { label: "", action: "set-color" },
    { label: "", action: "set-font-family" },
    { label: "Download Image", action: "download-image", icon: FaDownload },
    { label: "Delete Image", action: "delete-image", icon: FaTrash },
  ];

  return (
    <>
      <motion.div
        className="min-h-screen max-h-screen pt-20 px-10 py-10 bg-gradient-to-br from-[#050510] via-[#0c0c1f] to-[#131336] text-gray-100 relative overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        
        <input
          id="imageUploadInput"
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleImageUpload(e.target.files[0])}
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
              <h1 className="text-[1.2em] font-semibold tracking-wide">Edit Note</h1>
              <p className="text-gray-400 text-[0.8em]">
                Write, format, and style your ideas beautifully
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-fuchsia-600 to-purple-500 text-white rounded-lg hover:brightness-110 transition shadow-md shadow-fuchsia-600/30">
              <FaMagic size={14} /> Generate using AI
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-indigo-500 text-white rounded-lg hover:brightness-110 transition shadow-md shadow-blue-600/30"
            >
              <FaSave size={14} /> {saving ? "Saving..." : "Save Note"}
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

        {/* Toolbar */}
        <div
          className="
    flex flex-wrap items-center gap-2
    bg-[#0e1a2b]/70 border border-blue-500/20 rounded-xl
    px-3 py-2 mb-4 backdrop-blur-xl shadow-md shadow-blue-900/10
    overflow-x-auto
    max-w-full
    sm:justify-start justify-center
  "
        >
          {toolbarButtons.map(({ label, icon: Icon, action }, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={(e) => handleToolbarAction(action, e)}
                title={label}
                className="
          p-2 rounded-md
          hover:bg-blue-600/20
          text-gray-300 hover:text-white
          transition text-sm
          flex items-center
        "
              >
                {Icon ? <Icon size={11} /> : label}
              </button>

              {/* 🎨 Color Picker */}
              {action === "set-color" && (
                <input
                  type="color"
                  onChange={(e) => handleToolbarAction(action, e)}
                  className="ml-2 w-6 h-6 cursor-pointer border border-blue-500/30 rounded"
                  title="Pick text color"
                />
              )}

              {/* 🖋️ Font Family Dropdown */}
              {action === "set-font-family" && (
                <select
                  onChange={(e) => handleToolbarAction(action, e)}
                  className="
            ml-2 px-2 py-1 rounded-md border border-blue-500/30
            bg-white text-black text-sm cursor-pointer
            focus:outline-none focus:ring-1 focus:ring-blue-400
          "
                  title="Select Font"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Arial">Arial</option>
                </select>
              )}
            </div>
          ))}
        </div>


        {/* Hidden file input for image upload */}
        <div className="ml-4 flex items-center gap-2 text-xs text-gray-400">
          <label htmlFor="resize" className="whitespace-nowrap">
            Image width:
          </label>
          <input
            type="range"
            id="resize"
            min="100"
            max="800"
            step="10"
            value={imageWidth}
            onChange={(e) => {
              setImageWidth(e.target.value);
              editor
                .chain()
                .focus()
                .updateAttributes("image", { width: `${e.target.value}px` })
                .run();
            }}
            className="w-32 cursor-pointer"
          />
          <span>{imageWidth}px</span>
        </div>

        {/* Editor */}
        <motion.div
          className="bg-[#000000] backdrop-blur-2xl border border-blue-500/20 rounded-2xl shadow-lg overflow-hidden p-5 text-white h-[34rem] overflow-y-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <EditorContent editor={editor} />
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
      </motion.div >
      <Footer />
    </>
  );
}
