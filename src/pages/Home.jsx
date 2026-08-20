import Hero from "../components/Hero";
import Industries from "../components/Industries";
import ServicesGrid from "../components/ServicesGrid";
import About from "../components/About";
import Brands from "../components/Brands";
import Projects from "../components/Projects";
import Certifications from "../components/Certifications";
import Testimonial from "../components/Testimonial";

export default function Home() {
  return (
    <>
      <Hero />
      <Industries id="industries" />
      <ServicesGrid id="systems" />
      <About />
      <Brands />
      <Projects />
      <Certifications />
      <Testimonial />
    </>
  );
}
