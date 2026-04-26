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
    () => import("../../pages/data_entries/CreateVillages")
);
const TreatmentForm = lazy(() => import("../../components/TreatmentForm"));

const TryForm = lazy(() => import("../../components/TryForm"));
const SwipePage = lazy(() => import("../../components/SwipePage"));
const TryExcel = lazy(() => import("../../pages/home/TryExcel"));
const Login = lazy(() => import("../../pages/Login"));
const CreateUser = lazy(() => import("../../pages/CreateUser"));
const Dashboard = lazy(() => import("../../pages/home/Dashboard"));
const Labs = lazy(() => import("../../pages/data_entries/CreateLabs"));
const Settings = lazy(() => import("../../pages/home/Settings"));
const Reports = lazy(() => import("../../pages/home/Reports"));
const ManagePatients = lazy(
    () => import("../../pages/patients/ManagePatients")
);
const AlertsPage = lazy(() => import("../../pages/home/AlertsPage"));
import SelectInput from "../../components/SelectInput";
import PatientEditForm from "../../components/patients/PatientEditForm";

export const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/select-input",
        element: <PatientEditForm />,
      },
      {
        path: "/patients/create/excel-like",
        element: (
          <AdminRoute>
            <TryExcel />
          </AdminRoute>
        ),
      },
      {
        path: "/labs/create",
        element: (
          <AdminRoute>
            <Labs />
          </AdminRoute>
        ),
      },
      {
        path: "/patients/create/form",
        element: (
          <AdminRoute>
            <DataEntry />
          </AdminRoute>
        ),
      },

      {
        path: "/patients/manage",
        element: (
          <AdminRoute>
            <ManagePatients />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/user/create",
        element: (
          <AdminRoute>
            <CreateUser />
          </AdminRoute>
        ),
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
          <AdminRoute>
            <CreatePatients />
          </AdminRoute>
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
        path: "/alerts/",
        element: (
          <ProtectedRoute>
            <AlertsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/settings/",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },

      {
        path: "/Reports/",
        element: (
          <ProtectedRoute>
            <Reports />
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
          <AdminRoute>
            <ConditionForm />
          </AdminRoute>
        ),
      },
      {
        path: ROUTES.ENTRY.VILLAGE_CREATE,
        element: (
          <AdminRoute>
            <CreateVillages />
          </AdminRoute>
        ),
      },
      {
        path: ROUTES.ENTRY.TREATMENT_CREATE,
        element: (
          <AdminRoute>
            <TreatmentForm />
          </AdminRoute>
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
