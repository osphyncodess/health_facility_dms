import { lazy } from "react";
import { ROUTES } from "./routePaths";
import MainLayout from "../../layouts/MainLayout";
import DataEntry from "../../pages/home/DataEntry";
import PatientDetails from "../../pages/home/PatientDetails";
// import AuthLayout from "../../layouts/AuthLayout";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import ProtectedRoute from "../../components/ProtectedRoute";
const HomePage = lazy(() => import("../../pages/home/HomePage"));
// const LoginPage = lazy(() => import("../../pages/auth/LoginPage"));
// const RegisterPage = lazy(() => import("../../pages/auth/RegisterPage"));
// const DashboardPage = lazy(() => import("../../pages/dashboard/DashboardPage"));
// const UsersPage = lazy(() => import("../../pages/dashboard/UsersPage"));
// const SettingsPage = lazy(() => import("../../pages/dashboard/SettingsPage"));
const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));
const ConditionForm = lazy(() => import("../../components/ConditionForm"));
const VillageForm = lazy(() => import("../../components/VillageForm"));
const TreatmentForm = lazy(() => import("../../components/TreatmentForm"));
const SwipePage = lazy(() => import("../../components/SwipePage"));

export const routes = [
    {
        element: <MainLayout />,
        children: [
            {
                path: ROUTES.ENTRY.OPR_ENTRY,
                element: <DataEntry />
            },
            {
                path: ROUTES.HOME,
                element: <HomePage />
            },
            {
                path: "/patients/",
                element: <HomePage />
            },
            {
                path: "/swipe/",
                element: <SwipePage />
            },
            {
                path: ROUTES.ENTRY.DISEASE_CREATE,
                element: <ConditionForm />
            },
            {
                path: ROUTES.ENTRY.VILLAGE_CREATE,
                element: <VillageForm />
            },
            {
                path: ROUTES.ENTRY.TREATMENT_CREATE,
                element: <TreatmentForm />
            },
            {
                path: "patients/:id/",
                element: <PatientDetails />
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
