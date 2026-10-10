import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  ListTodo,
  NotebookTabs,
  UserRound,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationGroups = [
  {
    title: "MAIN MENU",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Subjects",
        path: "/subjects",
        icon: BookOpen,
      },
      {
        label: "Attendance",
        path: "/attendance",
        icon: ClipboardCheck,
      },
      {
        label: "Tasks & Assignments",
        path: "/tasks",
        icon: ListTodo,
      },
    ],
  },
  {
    title: "STUDY",
    items: [
      {
        label: "Notes Library",
        path: "/notes",
        icon: NotebookTabs,
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        label: "Profile",
        path: "/profile",
        icon: UserRound,
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          className="sidebar-overlay"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BookOpen size={22} />
          </div>

          <div className="brand-text">
            <h2>StudentHub</h2>
            <span>Academic workspace</span>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-navigation">
          {navigationGroups.map((group) => (
            <div className="navigation-group" key={group.title}>
              <p className="navigation-heading">{group.title}</p>

              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `navigation-link ${isActive ? "active" : ""}`
                    }
                  >
                    <Icon size={19} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="profile-avatar">S</div>

          <div className="sidebar-user">
            <strong>Student</strong>
            <span>Academic account</span>
          </div>
        </div>
      </aside>
    </>
  );
}