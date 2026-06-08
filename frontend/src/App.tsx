import { useEffect } from "react";
import { gsap } from "gsap";
import { AppRoutes } from "@/routes";

const App = () => {
  useEffect(() => {
    gsap.defaults({
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  return <AppRoutes />;
};

export default App;
