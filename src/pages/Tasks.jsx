import { useState } from "react";
import {
  Plus,
  Trash2,
  CalendarDays,
  ListTodo,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { subjectService, taskService } from "../services/api";

const priorities = ["Low", "Medium", "High"];

function formatDate(dateString) {
  if (!dateString) {
    return "No deadline";
  }

  return new Date(
    `${dateString}T00:00:00`,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(`${task.dueDate}T00:00:00`);

  return deadline < today;
}

export default function Tasks() {
  const [subjects] = useState(() => subjectService.getAll());

  const [tasks, setTasks] = useState(() => taskService.getAll());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      taskService.create({
        title,
        description,
        subjectId,
        dueDate,
        priority,
      });

      setTasks(taskService.getAll());

      setTitle("");
      setDescription("");
      setSubjectId("");
      setDueDate("");
      setPriority("Medium");

      setSuccess("Task created successfully.");
    } catch (err) {
      setError(err.message || "Unable to create task.");
    }
  }

  function handleToggle(task) {
    setError("");
    setSuccess("");

    try {
      taskService.update(task.id, {
        completed: !task.completed,
      });

      setTasks(taskService.getAll());
    } catch (err) {
      setError(err.message || "Unable to update task.");
    }
  }

  function handleDelete(task) {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    const updatedTasks = taskService.delete(task.id);

    setTasks(updatedTasks);
    setError("");
    setSuccess("Task deleted successfully.");
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") {
      return !task.completed;
    }

    if (filter === "Completed") {
      return task.completed;
    }

    return true;
  });

  const pendingCount = tasks.filter(
    (task) => !task.completed,
  ).length;

  const completedCount = tasks.filter(
    (task) => task.completed,
  ).length;

  function getSubjectName(id) {
    return subjects.find((subject) => subject.id === id)?.name
      || "General";
  }

  return (
    <div className="tasks-page">
      <section className="page-intro">
        <div>
          <h2>Tasks & Assignments</h2>
          <p>Organize your academic work and deadlines.</p>
        </div>
      </section>

      <section className="task-summary">
        <article className="task-summary-card">
          <span>All Tasks</span>
          <strong>{tasks.length}</strong>
        </article>

        <article className="task-summary-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </article>

        <article className="task-summary-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </article>
      </section>

      <section className="content-panel task-form-panel">
        <h3>Create a Task</h3>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field task-title-field">
            <label htmlFor="task-title">Task title</label>

            <input
              id="task-title"
              type="text"
              placeholder="e.g. Complete DBMS assignment"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-subject">Subject</label>

            <select
              id="task-subject"
              value={subjectId}
              onChange={(event) =>
                setSubjectId(event.target.value)
              }
            >
              <option value="">General task</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="task-due-date">Due date</label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              {priorities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field task-description-field">
            <label htmlFor="task-description">
              Description (optional)
            </label>

            <textarea
              id="task-description"
              rows="3"
              placeholder="Add assignment details..."
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={2000}
            />
          </div>

          {error && (
            <p className="feedback-message error-message" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p
              className="feedback-message success-message"
              role="status"
            >
              {success}
            </p>
          )}

          <button className="primary-button" type="submit">
            <Plus size={17} />
            Create Task
          </button>
        </form>
      </section>

      <section className="task-list-section">
        <div className="task-list-heading">
          <h3>My Tasks</h3>

          <div className="task-filters">
            {["All", "Pending", "Completed"].map((item) => (
              <button
                type="button"
                key={item}
                className={`filter-button ${
                  filter === item ? "filter-active" : ""
                }`}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <ListTodo size={30} />

            <h4>No tasks found</h4>

            <p>
              Create a task or select a different filter.
            </p>
          </div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <article
                className={`task-card ${
                  task.completed ? "task-completed" : ""
                }`}
                key={task.id}
              >
                <button
                  type="button"
                  className="task-toggle"
                  onClick={() => handleToggle(task)}
                  aria-label={
                    task.completed
                      ? `Mark ${task.title} as pending`
                      : `Mark ${task.title} as completed`
                  }
                  title={
                    task.completed
                      ? "Mark as pending"
                      : "Mark as completed"
                  }
                >
                  {task.completed ? (
                    <CheckCircle2 size={21} />
                  ) : (
                    <Circle size={21} />
                  )}
                </button>

                <div className="task-card-content">
                  <h4>{task.title}</h4>

                  {task.description && (
                    <p className="task-description">
                      {task.description}
                    </p>
                  )}

                  <div className="task-card-meta">
                    <span>{getSubjectName(task.subjectId)}</span>

                    <span>
                      <CalendarDays size={14} />
                      {formatDate(task.dueDate)}
                    </span>

                    {isOverdue(task) && (
                      <span className="overdue-badge">
                        Overdue
                      </span>
                    )}

                    <span
                      className={`priority-badge priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(task)}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}