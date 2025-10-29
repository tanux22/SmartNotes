// Footer.jsx
import React from "react";
import { motion } from "framer-motion";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <motion.footer
      className="w-full pt-10 pb-6 text-center text-gray-400 bg-black"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        
        {/* Branding */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-white text-2xl font-bold flex items-center justify-center md:justify-start">
            <MdOutlineLibraryBooks className="mr-2 text-black" /> Smart Notes
          </h3>
          <p className="text-gray-400 mt-1 text-sm">
            Organize, create, and access your notes smarter.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-6 mb-4 md:mb-0">
          <a href="/about" className="hover:text-white transition-colors" onClick={()=>navigate("/about")}>About</a>
          <a href="/signup" className="hover:text-white transition-colors" onClick={()=>navigate("/signup")}>Get Started</a>
          <a href="/contact" className="hover:text-white transition-colors" onClick={()=>navigate("/contact")}>Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-gray-500 text-sm mt-6">
        &copy; {new Date().getFullYear()} Smart Notes. All rights reserved.
      </p>
    </motion.footer>
  );
}
