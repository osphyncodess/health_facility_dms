import { lazy } from "react";
import { ROUTES } from "./routePaths";
import MainLayout from "../../layouts/MainLayout";
import DataEntry from "../../pages/home/DataEntry";
import PatientDetails from "../../pages/home/PatientDetails";
// import AuthLayout from "../../layouts/AuthLayout";
// import DashboardLayout from "../../layouts/DashboardLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminRoute from "../../components/AdminRoute";
const HomePage = lazy(() => import("../../pages/home/HomePage"));

const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));
const ConditionForm = lazy(() => import("../../components/ConditionForm"));
const VillageForm = lazy(() => import("../../components/VillageForm"));
const TreatmentForm = lazy(() => import("../../components/TreatmentForm"));
const SwipePage = lazy(() => import("../../components/SwipePage"));
const Login = lazy(() => import("../../pages/Login"));
const CreateUser = lazy(() => import("../../pages/CreateUser"));

export const routes = [
    {
        element: <MainLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/users/create",
                element: (
                    <AdminRoute>
                        <CreateUser />
                    </AdminRoute>
                )
            },
            {
                path: ROUTES.ENTRY.OPR_ENTRY,
                element: (
                    <ProtectedRoute>
                        <DataEntry />
                    </ProtectedRoute>
                )
            },
            {
                path: ROUTES.HOME || "/patients/",
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/patients/",
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/swipe/",
                element: <SwipePage />
            },
            {
                path: ROUTES.ENTRY.DISEASE_CREATE,
                element: (
                    <ProtectedRoute>
                        <ConditionForm />
                    </ProtectedRoute>
                )
            },
            {
                path: ROUTES.ENTRY.VILLAGE_CREATE,
                element: (
                    <ProtectedRoute>
                        <VillageForm />
                    </ProtectedRoute>
                )
            },
            {
                path: ROUTES.ENTRY.TREATMENT_CREATE,
                element: (
                    <ProtectedRoute>
                        <TreatmentForm />
                    </ProtectedRoute>
                )
            },
            {
                path: "patients/:id/",
                element: <ProtectedRoute>
                        <PatientDetails />
                    </ProtectedRoute>
            }
        ]
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
        element: <NotFoundPage />
    }
];
