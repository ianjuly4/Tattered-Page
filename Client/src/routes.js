import LandingPage from "./components/LandingPage";
import Home from "./components/Home"
import SearchResults from "./components/SearchResults";


const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/landingPage",
    element: <LandingPage />,
  },
  {
    path:"/books",
    elements: <SearchResults/>
  },
  
];

export default routes;