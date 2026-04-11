import { lazy } from "react";
import { ROUTES } from "./routePaths";
import MainLayout from "../../layouts/MainLayout";
import DataEntry from "../../pages/home/DataEntry";
import PatientDetails from "../../pages/home/PatientDetails";
// import AuthLayout from "../../layouts/AuthLayout";
// import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminRoute from "../../components/AdminRoute";
import CreatePatients from "../../pages/data_entries/CreatePatients";
const HomePage = lazy(() => import("../../pages/home/HomePage"));

const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));
const ConditionForm = lazy(() => import("../../components/ConditionForm"));
const CreateVillages = lazy(
  () => import("../../pages/data_entries/CreateVillages"),
);
const TreatmentForm = lazy(() => import("../../components/TreatmentForm"));

const TryForm = lazy(() => import("../../components/TryForm"));
const SwipePage = lazy(() => import("../../components/SwipePage"));
const TryExcel = lazy(() => import("../../pages/home/TryExcel"));
const Login = lazy(() => import("../../pages/Login"));
const CreateUser = lazy(() => import("../../pages/CreateUser"));
const Dashboard = lazy(() => import("../../pages/home/Dashboard"));

export const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/patients/create/excel-like",
        element: (
          <ProtectedRoute>
            <TryExcel />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patients/create/form",
        element: (
          <ProtectedRoute>
            <DataEntry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/user/create",
        element: <CreateUser />,
      },
      {
        path: "/users/create",
        element: (
          <AdminRoute>
            <CreateUser />
          </AdminRoute>
        ),
      },
      {
        path: ROUTES.ENTRY.OPR_ENTRY,
        element: (
          <ProtectedRoute>
            <CreatePatients />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.HOME || "/patients/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patients/",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/swipe/",
        element: <SwipePage />,
      },
      {
        path: ROUTES.ENTRY.DISEASE_CREATE,
        element: (
          <ProtectedRoute>
            <ConditionForm />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ENTRY.VILLAGE_CREATE,
        element: (
          <ProtectedRoute>
            <CreateVillages />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.ENTRY.TREATMENT_CREATE,
        element: (
          <ProtectedRoute>
            <TreatmentForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "patients/:id/",
        element: (
          <ProtectedRoute>
            <PatientDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
  //   {
  //     element: <AuthLayout />,
  //     children: [
  //       {
  //         path: ROUTES.AUTH.LOGIN,
  //         element: <LoginPage />,
  //       },
  //       {
  //         path: ROUTES.AUTH.REGISTER,
  //         element: <RegisterPage />,
  //       },
  //     ],
  //   },
  //   {
  //     path: ROUTES.DASHBOARD.ROOT,
  //     element: (
  //       <ProtectedRoute>
  //         <DashboardLayout />
  //       </ProtectedRoute>
  //     ),
  //     children: [
  //       {
  //         index: true,
  //         element: <DashboardPage />,
  //       },
  //       {
  //         path: "users",
  //         element: <UsersPage />,
  //       },
  //       {
  //         path: "settings",
  //         element: <SettingsPage />,
  //       },
  //     ],
  //   },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
