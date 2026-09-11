import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Students from "./Students";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public route */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin-only route */}
        <Route
          path="/students"
          element={
            <ProtectedRoute role="admin">
              <Students />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;