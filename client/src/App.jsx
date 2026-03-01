import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Farmer from "./pages/Farmer";
import Restaurant from "./pages/Restaurant";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/farmer" element={<Farmer />} />
        <Route path="/restaurant" element={<Restaurant />} />
      </Routes>
    </Router>
  );
}

export default App;