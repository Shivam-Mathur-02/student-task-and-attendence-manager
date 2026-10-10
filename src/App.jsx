import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import NotesLibrary from "./pages/NotesLibrary";
import Sharing from "./pages/Sharing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/subjects"
            element={<Subjects />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/notes"
            element={<NotesLibrary />}
          />

          <Route 
            path="/sharing" 
            element={<Sharing />} 
          />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;