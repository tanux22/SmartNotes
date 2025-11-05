import { useState, useEffect } from "react";
import axios from "axios";

export default function useNoteSearch(searchQuery) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:3000/api/notes/search?query=${encodeURIComponent(searchQuery)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(response.data.data || response.data); // adjust depending on your backend response
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 400); // debounce 400ms
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return { results, loading };
}
