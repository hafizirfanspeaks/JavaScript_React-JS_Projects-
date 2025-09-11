import React, { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import MovieDetail from "./components/MovieDetail";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const API_KEY = "35565b2a";

  // ✅ Popular Movies (default)
  async function fetchPopular() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=Avengers`
      );
      const data = await res.json();
      setMovies(data.Search || []);
    } catch (err) {
      console.error("Error fetching popular movies:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Load popular on mount
  useEffect(() => {
    fetchPopular();
  }, []);

  // ✅ Search logic
  useEffect(() => {
    async function fetchMovies() {
      if (!query) {
        fetchPopular();
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );
        const data = await res.json();
        setMovies(data.Search || []);
      } catch (err) {
        console.error("Error searching movies:", err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [query]);

  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1740&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-white mb-6 text-center drop-shadow-lg">
          🎬 Movie Finder
        </h1>

        {/* Search Bar */}
        <SearchBar onSearch={setQuery} />

        {loading && <p className="mt-4 text-white text-center">Loading...</p>}

        {!loading && movies.length === 0 && (
          <p className="mt-4 text-gray-300 text-center">No movies found.</p>
        )}

        {/* Movies Grid */}
        <MovieGrid movies={movies} onSelect={(movie) => setSelectedMovie(movie)} />
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
