import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import BookDetails from "./components/BookDetails"
import NotFound from "./components/NotFound";
import BookShelves from "./components/BookShelves";
import Account from "./components/Account";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Avatars from "./components/Avatars";
import Bookclubs from "./components/Bookclubs";

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
    element: <Signup/>
  },
  {
    path: "/auth/login",
    element: <Login/>
  },
  {
    path:"/avatar",
    element: <Avatars/>
  },
  {
    path: "/bookclubs",
    element: <Bookclubs/>
  },
  {
   path:"*", 
   element:<NotFound />
  }

];

export default routes;
