import { useState } from "react";
import {
  Share2,
  Send,
  Trash2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Users,
} from "lucide-react";

import {
  taskService,
  subjectService,
  sharingService,
} from "../services/api";

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

export default function Sharing() {
  const [tasks] = useState(() => taskService.getAll());
  const [subjects] = useState(() => subjectService.getAll());

  const [shares, setShares] = useState(() =>
    sharingService.getAll(),
  );

  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [activeTab, setActiveTab] = useState("shared-by-me");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleShare(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const task = tasks.find(
      (item) => item.id === selectedTaskId,
    );

    if (!task) {
      setError("Please select an assignment.");
      return;
    }

    try {
      sharingService.create(task, recipientEmail);

      setShares(sharingService.getAll());
      setRecipientEmail("");
      setSelectedTaskId("");

      setSuccess(
        "Assignment added to the sharing prototype.",
      );
    } catch (err) {
      setError(err.message || "Unable to share assignment.");
    }
  }

  function handleRecipientStatus(share) {
    const updatedShares = sharingService.updateRecipientStatus(
      share.id,
      !share.recipientCompleted,
    );

    setShares(updatedShares);
  }

  function handleDelete(share) {
    const confirmed = window.confirm(
      `Remove the sharing record for "${share.taskTitle}"?`,
    );

    if (!confirmed) {
      return;
    }

    const updatedShares = sharingService.delete(share.id);

    setShares(updatedShares);
    setError("");
    setSuccess("Sharing record removed.");
  }

  function getSubjectName(subjectId) {
    return (
      subjects.find((subject) => subject.id === subjectId)?.name ||
      "General"
    );
  }

  const sharedByMe = shares;

  // The current prototype has no authenticated recipient account.
  // Consequently, it cannot reliably identify assignments shared
  // with the currently logged-in student.
  const sharedWithMe = [];

  const displayedShares =
    activeTab === "shared-by-me" ? sharedByMe : sharedWithMe;

  return (
    <div className="sharing-page">
      <section className="page-intro">
        <div>
          <h2>Assignment Sharing</h2>
          <p>
            Share academic assignments and keep track of shared work.
          </p>
        </div>
      </section>

      <section className="content-panel sharing-form-panel">
        <h3>Share an Assignment</h3>

        {tasks.length === 0 ? (
          <p className="empty-message">
            Create a task before sharing an assignment.
          </p>
        ) : (
          <form className="sharing-form" onSubmit={handleShare}>
            <div className="form-field">
              <label htmlFor="share-task">Assignment</label>

              <select
                id="share-task"
                value={selectedTaskId}
                onChange={(event) =>
                  setSelectedTaskId(event.target.value)
                }
                required
              >
                <option value="">Select an assignment</option>

                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="recipient-email">
                Friend's email
              </label>

              <input
                id="recipient-email"
                type="email"
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={(event) =>
                  setRecipientEmail(event.target.value)
                }
                required
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
              <Send size={17} />
              Share Assignment
            </button>
          </form>
        )}
      </section>

      <section className="sharing-section">
        <div className="sharing-tabs">
          <button
            type="button"
            className={
              activeTab === "shared-by-me" ? "sharing-tab active" : "sharing-tab"
            }
            onClick={() => setActiveTab("shared-by-me")}
          >
            <Share2 size={16} />
            Shared by Me ({sharedByMe.length})
          </button>

          <button
            type="button"
            className={
              activeTab === "shared-with-me" ? "sharing-tab active" : "sharing-tab"
            }
            onClick={() => setActiveTab("shared-with-me")}
          >
            <Users size={16} />
            Shared with Me ({sharedWithMe.length})
          </button>
        </div>

        {displayedShares.length === 0 ? (
          <div className="empty-state">
            <Share2 size={30} />

            <h4>
              {activeTab === "shared-by-me"
                ? "No shared assignments yet"
                : "No received assignments"}
            </h4>

            <p>
              {activeTab === "shared-by-me"
                ? "Select an assignment and add a recipient above."
                : "Received assignments will appear here when authenticated sharing is implemented."}
            </p>
          </div>
        ) : (
          <div className="shared-assignment-list">
            {displayedShares.map((share) => (
              <article className="shared-assignment-card" key={share.id}>
                <div className="shared-assignment-icon">
                  <Share2 size={20} />
                </div>

                <div className="shared-assignment-content">
                  <h4>{share.taskTitle}</h4>

                  <p>{getSubjectName(share.subjectId)}</p>

                  {share.description && (
                    <p>{share.description}</p>
                  )}

                  <div className="shared-assignment-meta">
                    <span>
                      <CalendarDays size={14} />
                      {formatDate(share.dueDate)}
                    </span>

                    <span>
                      To: {share.recipientEmail}
                    </span>

                    <span
                      className={`priority-badge priority-${share.priority.toLowerCase()}`}
                    >
                      {share.priority}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="recipient-status-button"
                    onClick={() => handleRecipientStatus(share)}
                  >
                    {share.recipientCompleted ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Circle size={16} />
                    )}

                    {share.recipientCompleted
                      ? "Marked completed in this prototype"
                      : "Mark completed (prototype only)"}
                  </button>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Remove sharing record for ${share.taskTitle}`}
                  title="Remove sharing record"
                  onClick={() => handleDelete(share)}
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