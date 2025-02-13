import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import BookDetails from "./components/BookDetails";
import NotFound from "./components/NotFound";
import BookShelves from "./components/BookShelves";
import Account from "./components/Account";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Avatars from "./components/Avatars";
import Bookclubs from "./components/Bookclubs";
import UsersBookclubs from "./components/UsersBookclubs";

// Define the routes using createBrowserRouter
const routes = [
  {
    path: "/",
    element: <Home />,  // Main homepage route
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
    path: "/books/:bookKey",  // Dynamic route for a specific book
    element: <BookDetails />,
  },
  {
    path: "/bookshelves",
    element: <BookShelves />,
  },
  {
    path: "/account",
    element: <Account />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/avatar",
    element: <Avatars />,
  },
  {
    path: "/bookclubs",
    element: <Bookclubs />,
  },
  {
    path: "/users/:userId/bookclubs",  // Dynamic route for specific user's bookclubs
    element: <UsersBookclubs />,
  },
  {
    path: "*",  // Catch-all route for undefined paths
    element: <NotFound />,
  },
];

export default routes;
