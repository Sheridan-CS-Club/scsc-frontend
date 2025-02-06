import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "@components/Navbar";
// import Footer from "@components/Footer";
import Home from "@pages/Home";
// import About from "@pages/About";
// import Contact from "@pages/Contact";
import { Toaster } from 'sonner'
import './index.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster
          // position="top-center"
          toastOptions={{
            className: "toast",
          }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
