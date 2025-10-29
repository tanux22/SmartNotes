import React from 'react'
import Navbar from './components/Navbar';
import "tailwindcss";
import HomePage from './pages/HomePage';
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
// import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import CreateNotePage from './pages/CreateNotePage';
import Tiptap from './pages/Tiptap';
import EditNotePage from './pages/EditNotePage';
import ViewPage from './pages/ViewPage';


const App = () => {

  const token = localStorage.getItem("accessToken");
  console.log("Token in App.jsx:", token);
  const location = useLocation();


  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={token ? <HomePage /> : <Navigate to="/login" replace />} />

        <Route path="/about" element={<About />} />

        <Route path="/create-note/:folderId" element={<CreateNotePage />} />

        <Route path="/edit-note/:noteId" element={<EditNotePage />} />

        <Route path="/view-note/:noteId" element={<ViewPage />} />

        <Route path="/test" element={<Tiptap />} />

        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" replace />}
        />

        {/* <Route path="/create" element={<ProtectedRoute> <CreatePage /> </ProtectedRoute>} />
        <Route path="/note/:id" element={<ProtectedRoute> <NoteDetailPage /> </ProtectedRoute>} /> */}

      </Routes>
    </>
  )
}

export default App;