import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";

// Section order from intent/spec.md 3.2.
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Stack />
      <Contact />
    </>
  );
}
