import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@components/Navbar";
// import Footer from "@components/Footer";
import Home from "@pages/Home";
// import About from "@pages/About";
// import Contact from "@pages/Contact";
import { Toaster } from 'sonner'
import './index.css'

function App() {
  return (
    <>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Toaster
          // position="top-center"
          toastOptions={{
            className: "toast",
            duration: 5000,
          }}
        />
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
