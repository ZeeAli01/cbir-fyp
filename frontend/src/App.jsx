import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/auth";
import Layout from "./Components/Layout";
import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import FileUpload from "./Components/FileUpload";
import Output from "./Components/Output";
import ApiKeyManagement from "./Components/ApiKeyManagement";
import AuditReport from "./Components/AuditReport";
import "./App.css";
function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isLoggedIn ? <Register /> : <Navigate to="/" />}
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="upload"
          element={isLoggedIn ? <FileUpload /> : <Navigate to="/login" />}
        />
        <Route
          path="output"
          element={isLoggedIn ? <Output /> : <Navigate to="/login" />}
        />
        <Route
          path="apikey"
          element={isLoggedIn ? <ApiKeyManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="audit"
          element={isLoggedIn ? <AuditReport /> : <Navigate to="/login" />}
        />
      </Route>
    </Routes>
  );
}

export default App;
