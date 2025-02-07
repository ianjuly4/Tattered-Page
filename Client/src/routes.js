import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import BookDetails from "./components/BookDetails"

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
    path: "/books",
    element: <SearchResults />,
  },
  {
    path: "/books/:bookKey",
    element: <BookDetails/>
  }
];

export default routes;
