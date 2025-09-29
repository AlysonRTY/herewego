import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import AboutMe from "./pages/AboutMe";
import Navigation from "./components/Navigation";
import DuckFacts from "./pages/DuckFacts";
import Skills from "./pages/Skills";
import Contact from "./pages/Contact";
import BerlinTime from "./pages/BerlinTime";
import ReactDemos from "./pages/ReactDemos";
import MemoryGame from "./pages/MemoryGame";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="aboutMe" element={<AboutMe />} />
          <Route path="duckFacts" element={<DuckFacts />} />
          <Route path="skills" element={<Skills />} />
          <Route path="contact" element={<Contact />} />
          <Route path="berlin-time" element={<BerlinTime />} />
          <Route path="react-demos" element={<ReactDemos />} />
          <Route path="memory-game" element={<MemoryGame />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
