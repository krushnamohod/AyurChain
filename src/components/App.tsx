import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts and Pages
import AIAssistantPage from "../pages/AIAssistantPage";
import HerbPortal from "../pages/HerbPortal";
import LandingPage from "../pages/LandingPage";
import NotFound from "../pages/NotFound";
import RootLayout from "./RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />, // A simple error element for the root
    children: [
      {
        index: true, // This makes it the default child route for "/"
        element: <LandingPage />,
      },
      {
        path: "herb-portal",
        element: <HerbPortal />,
      },
      // You can add other top-level pages here in the future
      // {
      //   path: "about",
      //   element: <AboutPage />,
      // },
    ],
  },
  {
    path: "ai-assistant",
    element: <AIAssistantPage />,
    errorElement: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;