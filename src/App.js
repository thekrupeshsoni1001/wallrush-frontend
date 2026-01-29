import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import Collections from "./pages/Collections";
import CollectionPage from "./pages/CollectionPage";
import SearchResults from "./pages/SearchResults";
import Saved from "./pages/Saved";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import GlobalBack from "./components/GlobalBack";
import BackToTop from "./components/BackToTop";
import Settings from "./pages/Settings";
import Preferences from "./pages/Preferences";

function App() {
  return (
      <Router>
        <ScrollToTop />
        <Navbar />
        <GlobalBack />
        <BackToTop />

        <Routes>
          <Route path="/" element={<><Hero /><Home /></>} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collection/:type/:name" element={<CollectionPage />} />
          <Route path="/collection/:name" element={<CollectionPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>

        <Footer />
      </Router>
  );
}

export default App;
