import { Menu, Search, Bell } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/subjects": "Subjects",
  "/attendance": "Attendance",
  "/tasks": "Tasks & Assignments",
  "/notes": "Notes Library",
  "/profile": "My Profile",
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || "StudentHub";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-button menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>

        <div className="page-heading">
          <h1>{pageTitle}</h1>
          <p>Manage your academic life in one place.</p>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-button"
          aria-label="Search"
          title="Search"
        >
          <Search size={20} />
        </button>

        <button
          className="icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="topbar-avatar" aria-label="Student profile">
          S
        </div>
      </div>
    </header>
  );
}