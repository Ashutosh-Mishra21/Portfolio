import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Starfield from "./components/Starfield";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Galaxy from "./components/Galaxy";
import SolarSystem from "./components/SolarSystem";
import Shuttle from "./components/Shuttle";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Blackhole from "./pages/Blackhole";
import { Toaster } from "./components/ui/toaster";
import { HighlightProvider } from "./context/HighlightContext";

const Home = () => {
  return (
    <div className="relative min-h-screen grain">
      <Starfield density={1} />
      <main className="relative z-10">
        <Hero />
        <Galaxy />
        <SolarSystem />
        <Shuttle />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HighlightProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blackhole" element={<Blackhole />} />
          </Routes>
          <Toaster />
        </HighlightProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
