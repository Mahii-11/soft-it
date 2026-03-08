import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home"; 
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import ThankYouPage from "./pages/ThankYouPage";
import AuthPage from "./pages/AuthPage";

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
      },

      {
        path: "/product-details/:slug",
        element: <ProductDetails />
      },

      {

        path: "/thank-you",
        element: <ThankYouPage/>
      },

      {
        path: "/login",
        element: <AuthPage/>
      }



    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
