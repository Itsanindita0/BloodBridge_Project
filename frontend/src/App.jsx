import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Donor from "./pages/Donor";
import Receiver from "./pages/Receiver";
import Requests from "./pages/Requests";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return ( 
    <>
      <Navbar />

      <div className="container mx-auto mt-6 px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/receiver" element={<Receiver />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
}
