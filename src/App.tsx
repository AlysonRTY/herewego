import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
