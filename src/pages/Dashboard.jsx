import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardCheck,
  ListTodo,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

import StatCard from "../components/StatCard";

import {
  subjectService,
  attendanceService,
  taskService,
} from "../services/api";

const ATTENDANCE_THRESHOLD = 75;

function calculatePercentage(attended, total) {
  if (total === 0) {
    return 0;
  }

  return Math.round((attended / total) * 100);
}

function formatDate(dateString) {
  if (!dateString) {
    return "No deadline";
  }

  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function isUpcoming(task) {
  if (!task.dueDate || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${task.dueDate}T00:00:00`);

  return dueDate >= today;
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(() => {
    try {
      setError("");

      setSubjects(subjectService.getAll());
      setAttendance(attendanceService.getAll());
      setTasks(taskService.getAll());
    } catch (err) {
      setError(
        err.message || "Unable to load dashboard information.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      if (!cancelled) {
        loadDashboardData();
      }
    };

    load();

    window.addEventListener("focus", load);

    window.addEventListener("storage", load);

    return () => {
      cancelled = true;

      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
    };
  }, [loadDashboardData]);

  const attendanceBySubject = subjects.map((subject) => {
    const record = attendance.find(
      (item) => item.subjectId === subject.id,
    );

    const attended = record?.attended ?? 0;
    const total = record?.total ?? 0;

    return {
      ...subject,
      attended,
      total,
      percentage: calculatePercentage(attended, total),
      hasRecord: Boolean(record),
    };
  });

  const totalClasses = attendanceBySubject.reduce(
    (sum, subject) => sum + subject.total,
    0,
  );

  const totalAttended = attendanceBySubject.reduce(
    (sum, subject) => sum + subject.attended,
    0,
  );

  const overallAttendance = calculatePercentage(
    totalAttended,
    totalClasses,
  );

  const pendingTasks = tasks.filter(
    (task) => !task.completed,
  );

  const completedTasks = tasks.filter(
    (task) => task.completed,
  );

  const upcomingTasks = pendingTasks
    .filter(isUpcoming)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 5);

  const lowAttendanceSubjects = attendanceBySubject.filter(
    (subject) =>
      subject.hasRecord &&
      subject.percentage < ATTENDANCE_THRESHOLD,
  );

  function getSubjectName(subjectId) {
    return (
      subjects.find((subject) => subject.id === subjectId)?.name ||
      "General"
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard-welcome">
        <div>
          <h2>Welcome back!</h2>
          <p>Here's an overview of your academic progress.</p>
        </div>

        <div className="dashboard-date">
          <CalendarDays size={17} />

          <span>
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      {error && (
        <p className="feedback-message error-message" role="alert">
          {error}
        </p>
      )}

      <section
        className="stats-grid"
        aria-label="Academic statistics"
      >
        <StatCard
          title="Total Subjects"
          value={subjects.length}
          description="Subjects being tracked"
          icon={BookOpen}
          variant="primary"
        />

        <StatCard
          title="Overall Attendance"
          value={`${overallAttendance}%`}
          description={
            totalClasses > 0
              ? `${totalAttended} of ${totalClasses} classes attended`
              : "No attendance records yet"
          }
          icon={ClipboardCheck}
          variant="success"
        />

        <StatCard
          title="Pending Tasks"
          value={pendingTasks.length}
          description="Tasks awaiting completion"
          icon={ListTodo}
          variant="warning"
        />

        <StatCard
          title="Completed Tasks"
          value={completedTasks.length}
          description="Tasks completed"
          icon={CheckCircle2}
          variant="success"
        />
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel attendance-panel">
          <div className="panel-header">
            <div>
              <h3>Attendance Overview</h3>
              <p>Attendance percentage by subject</p>
            </div>
          </div>

          {attendanceBySubject.length === 0 ? (
            <p className="empty-message">
              Add subjects to start tracking attendance.
            </p>
          ) : (
            <div className="attendance-list">
              {attendanceBySubject.map((subject) => {
                const isLow =
                  subject.hasRecord &&
                  subject.percentage < ATTENDANCE_THRESHOLD;

                return (
                  <article
                    className="attendance-item"
                    key={subject.id}
                  >
                    <div className="attendance-item-header">
                      <div>
                        <h4>{subject.name}</h4>

                        <p>
                          {subject.hasRecord
                            ? `${subject.attended} of ${subject.total} classes attended`
                            : "No attendance recorded yet"}
                        </p>
                      </div>

                      <span
                        className={`attendance-percentage ${
                          isLow ? "text-danger" : ""
                        }`}
                      >
                        {subject.percentage}%
                      </span>
                    </div>

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label={`${subject.name} attendance`}
                      aria-valuenow={subject.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className={`progress-fill ${
                          isLow ? "progress-low" : ""
                        }`}
                        style={{
                          width: `${subject.percentage}%`,
                        }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-panel tasks-panel">
          <div className="panel-header">
            <div>
              <h3>Upcoming Tasks</h3>
              <p>Your next academic deadlines</p>
            </div>
          </div>

          {upcomingTasks.length === 0 ? (
            <p className="empty-message">
              No upcoming deadlines. Add a task to get started.
            </p>
          ) : (
            <div className="upcoming-task-list">
              {upcomingTasks.map((task) => (
                <article
                  className="upcoming-task"
                  key={task.id}
                >
                  <div className="task-marker" />

                  <div className="upcoming-task-content">
                    <h4>{task.title}</h4>

                    <p>{getSubjectName(task.subjectId)}</p>

                    <div className="task-meta">
                      <span>
                        <CalendarDays size={14} />
                        {formatDate(task.dueDate)}
                      </span>

                      <span
                        className={`priority-badge priority-${(
                          task.priority || "Medium"
                        ).toLowerCase()}`}
                      >
                        {task.priority || "Medium"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {lowAttendanceSubjects.length > 0 && (
        <section className="dashboard-panel warning-panel">
          <div className="warning-heading">
            <AlertTriangle size={20} />

            <div>
              <h3>Attendance Needs Attention</h3>

              <p>
                These subjects have recorded attendance below 75%.
              </p>
            </div>
          </div>

          <ul className="warning-list">
            {lowAttendanceSubjects.map((subject) => (
              <li key={subject.id}>
                <span>{subject.name}</span>
                <strong>{subject.percentage}%</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}