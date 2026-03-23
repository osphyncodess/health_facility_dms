import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AppRouter from "./app/router/AppRouter";
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
