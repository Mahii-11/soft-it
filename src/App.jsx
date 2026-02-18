import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home"; 
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    path: "/", 
    element: <AppLayout />,
    children: [
      {
        path: "/", 
        element: <Home />,
      },

      {
        path: "/cart",
        element: <Cart />,
       },
       
      {
        path: "/checkout",
        element: <Checkout />
      },

      {
        path: "/profile",
        element: <Profile />
      }

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
