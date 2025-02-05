import Navbar from "../components/navbar";
import Hero from "../components/hero";
import CatSlider from "../components/catSlider";

export default function Home() {
  return (
    <div>
      <Navbar />
        <Hero />
        <CatSlider />
    </div>
  );
}
