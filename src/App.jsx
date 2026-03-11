import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home"; 
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import ThankYouPage from "./pages/ThankYouPage";
import AuthPage from "./pages/AuthPage";
import SearchPage from "./pages/SearchPage";
import OnlineSale from "./pages/OnlineSale";
import SearchResultsPage from "./pages/SearchResultsPage";
import OurLocation from "./pages/OurLocation";
import Dashboard from "./pages/dasboardpage/Dashboard";
import Orders from "./pages/dasboardpage/Orders";
import Account from "./pages/dasboardpage/Account";

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
      },

      {
        path: "/search",
        element: <SearchPage/>
      },

      {

        path: "/online-sale",
        element: <OnlineSale/>
      },

      {
        path: "/search-results",
        element: <SearchResultsPage/>
      },

      {
        path: "/our-location",
        element: <OurLocation/>
      },
      
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/orders",
    element: <Orders />,
  },
 
  {
    path: "/dashboard/profile",
    element: <Account />,
  },

    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
