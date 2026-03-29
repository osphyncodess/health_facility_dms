import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AppRouter from "./app/router/AppRouter";
import AuthProvider from "./auth/AuthContext"; // 👈 add this


function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                
                <Suspense fallback={<div>Loading...</div>}>
                    <AppRouter />
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
