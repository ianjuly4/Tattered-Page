import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import BookDetails from "./components/BookDetails"
import NotFound from "./components/NotFound";
import BookShelves from "./components/BookShelves";
import Account from "./components/Account";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";

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
    path: "/signup",
    element: <CreateAccount/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
   path:"*", 
   element:<NotFound />
  }

];

export default routes;
