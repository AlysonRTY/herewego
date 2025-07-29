import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import AboutMe from "./pages/AboutMe";
import Navigation from "./components/Navigation";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="aboutMe" element={<AboutMe />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
