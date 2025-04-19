import { useEffect, useState } from "react";
import "./App.css";
import Search from "./components/Search";
import axios from "axios";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieLists, setMovieLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce the search term to prevent making too many API request
  // by waiting for the user stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  // Add initial project setup with Vite, Tailwind CSS basic structure for frontend and implement movie search feature

  const fetchMovies = async (query = "") => {
    console.log(query);
    setLoading(true);
    setErrorMessage("");
    try {
      const endPoint = query
        ? // ? `${API_BASE_URL}/discover/movie?query=${encodeURIComponent(query)}`
          `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await axios.get(endPoint, {
        headers: { Authorization: `Bearer ${API_KEY}` },
      });

      setMovieLists(response.data.results || []);
    } catch (error) {
      console.error(`Error fetching movies ${error}`);
      setErrorMessage("Error fetching movies. please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {loading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-400">{errorMessage}</p>
          ) : (
            <ul>
              {movieLists.map((movie) => (
                <MovieCard key={movie?.id} movie={movie} />
              ))}
            </ul>
          )}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
}

export default App;
