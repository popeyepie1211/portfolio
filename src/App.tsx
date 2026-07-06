import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { Preloader } from "./components/Preloader";
import { CustomCursor } from "./components/layout/CustomCursor";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Experience } from "./components/sections/Experience";
import { Hero } from "./components/sections/Hero";
import { Projects } from "./components/sections/Projects";
import { Testimonials } from "./components/sections/Testimonials";
import { CursorTrail } from "./components/ui/CursorTrail";
import { SectionMorphBlob } from "./components/ui/SectionMorphBlob";
import { SkillChips } from "./components/ui/SkillChips";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <SectionMorphBlob />
          <CustomCursor />
          <CursorTrail />
          <ScrollProgress />
          <Navbar />
          <main>
            <Hero />
            <About />
            <SkillChips />
            <Projects />
            <Experience />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
}

export default App;
