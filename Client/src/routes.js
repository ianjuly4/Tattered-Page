import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import BookDetails from "./components/BookDetails"
import NotFound from "./components/NotFound";
import BookShelves from "./components/BookShelves";
import Account from "./components/Account";

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
  },
  {
    path: "/bookshelves",
    element: <BookShelves/>
  },
  {
    path: "/account",
    element: <Account/>
  },
  {
   path:"*", 
   element:<NotFound />
  }

];

export default routes;
