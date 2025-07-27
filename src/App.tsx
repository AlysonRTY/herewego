import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import AboutMe from "./pages/AboutMe";

function App() {
  return (
    <>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="aboutMe" element={<AboutMe />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
