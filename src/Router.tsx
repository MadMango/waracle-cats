import { createBrowserRouter, RouterProvider } from "react-router";
import { HomePage } from "./pages/Home.page";
import { UploadPage } from "./pages/Upload.page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/upload",
    element: <UploadPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
