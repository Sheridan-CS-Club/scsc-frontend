import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@components/Navbar";
// import Footer from "@components/Footer";
import Home from "@pages/Home";
import Events from "@pages/Events";
import Minileets from "@pages/Minileets";
// import About from "@pages/About";
// import Contact from "@pages/Contact";
import { Toaster } from 'sonner'
import { Analytics } from "@vercel/analytics/react"
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
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/events" element={<Events />} />
          <Route path="/minileets" element={<Minileets />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </BrowserRouter>
      <Analytics/>
    </>
  );
}

export default App;
