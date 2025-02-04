import LandingPage from "./components/LandingPage";
import Home from "./components/Home"


const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/landingPage",
    element: <LandingPage />,
  },
  
];

export default routes;