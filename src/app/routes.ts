import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Contracts from "./pages/Contracts";
import Payments from "./pages/Payments";
import Income from "./pages/Income";
import Simulation from "./pages/Simulation";
import TaxReport from "./pages/TaxReport";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Documents from "./pages/Documents";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "contracts", Component: Contracts },
      { path: "payments", Component: Payments },
      { path: "income", Component: Income },
      { path: "simulation", Component: Simulation },
      { path: "tax-report", Component: TaxReport },
      { path: "notifications", Component: Notifications },
      { path: "settings", Component: Settings },
      { path: "documents", Component: Documents },
    ],
  },
]);