import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import AboutMe from "./pages/AboutMe";
import Navigation from "./components/Navigation";
import DuckFacts from "./pages/DuckFacts";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="aboutMe" element={<AboutMe />} />
          <Route path="duckFacts" element={<DuckFacts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
