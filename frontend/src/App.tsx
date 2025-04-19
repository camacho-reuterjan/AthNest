import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import LoadingAnimation from "./components/loading-animation";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LoginPage = lazy(() => import("./pages/Auth/Login"));
const RegisterPage = lazy(() =>
  delay(1000).then(() => import("./pages/Auth/Register"))
);
const HomePage = lazy(() =>
  delay(1000).then(() => import("./pages/Dashboard/Homepage"))
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-base">
          <LoadingAnimation />
        </div>
      }
    >
      <Routes>
        <Route path="" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
