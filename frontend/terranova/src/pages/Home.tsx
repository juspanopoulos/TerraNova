import Climate from "@/components/Climate";
import Growth from "@/components/Growth";
import Alerts from "@/components/Alerts";
import SmartMap from "@/components/SmartMap";
import Water from "@/components/Water";
import { HomeNavbar } from "@/components/HomeNavbar";
import { HeroParallax } from "@/components/HeroParallax";

const Home = () => {
  return (
    <>
      <div className="bg-surface-night">
        <HeroParallax />
        <HomeNavbar />
      </div>
      <Climate />
      <Growth />
      <Water />
      <Alerts />
      <SmartMap />
    </>
  );
};

export default Home;
