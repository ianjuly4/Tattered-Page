import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import SearchResults from "./components/Books/SearchResults";
import BookDetails from "./components/Books/BookDetails";
import NotFound from "./components/NotFound";
import BookShelves from "./components/Bookshelves/BookShelves";
import Account from "./components/Profile/Account";
import Login from "./components/Profile/Login";
import Signup from "./components/Profile/Signup";

import Bookclubs from "./components/Bookclubs/Bookclubs";
import UsersBookclubs from "./components/Bookclubs/UsersBookclubs";
import UserBookshelves from "./components/Bookshelves/UserBookshelves";
import BookshelfDetails from "./components/Bookshelves/BookshelfDetail"
import UserBookDetails from "./components/Books/UserBookDetails";


const routes = [
  {
    path: "/dashboard",
    element: <Home />,  
  },
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/books",
    element: <SearchResults />,
  },
  {
    path: "/books/:bookId",
    element: <BookDetails/>
  },
  {
    path: "/users/:userId/books/:bookId",
    element: <UserBookDetails/>
  },
  {
    path: "/bookshelves",
    element: <BookShelves />,
  },
  {
    path: "/users/:userId/bookshelves",
    element: <UserBookshelves/>
  },
 
  {
    path: "/users/:userId/bookshelves/:bookshelfId",
    element: <BookshelfDetails/>
  },
  {
    path: "/users/:userId",
    element: <Account />,
  }, 
  {
    path: "/users",
    element: <Signup />,
  }, 
  {
    path: "/login",
    element: <Login />,
  },
  
  {
    path: "/bookclubs",
    element: <Bookclubs />,
  },
  {
    path: "/users/:userId/bookclubs",  
    element: <UsersBookclubs />,
  },
  {
    path: "*", 
    element: <NotFound />,
  },
];

export default routes;
