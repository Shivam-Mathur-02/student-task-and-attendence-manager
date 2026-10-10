import {  useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { subjectService } from "../services/api";

export default function Subjects() {
  
  const [subjectName, setSubjectName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [subjects, setSubjects] = useState(() =>
  subjectService.getAll(),
  );

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      subjectService.create(subjectName);

      setSubjects(subjectService.getAll());
      setSubjectName("");
      setSuccess("Subject added successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete(subjectId, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );

    if (!confirmed) {
      return;
    }

    const updatedSubjects = subjectService.delete(subjectId);

    setSubjects(updatedSubjects);
    setError("");
    setSuccess("Subject deleted successfully.");
  }

  return (
    <div className="subjects-page">
      <section className="page-intro">
        <div>
          <h2>My Subjects</h2>
          <p>Organize and manage your academic subjects.</p>
        </div>

        <span className="subject-count">
          {subjects.length}{" "}
          {subjects.length === 1 ? "subject" : "subjects"}
        </span>
      </section>

      <section className="content-panel">
        <h3>Add a Subject</h3>

        <form className="subject-form" onSubmit={handleSubmit}>
          <label htmlFor="subject-name">Subject name</label>

          <div className="subject-input-row">
            <input
              id="subject-name"
              type="text"
              placeholder="e.g. Database Management Systems"
              value={subjectName}
              onChange={(event) => {
                setSubjectName(event.target.value);
                setError("");
                setSuccess("");
              }}
              maxLength={100}
              required
            />

            <button className="primary-button" type="submit">
              <Plus size={18} />
              Add Subject
            </button>
          </div>
        </form>

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
      </section>

      <section className="subjects-section">
        <h3>All Subjects</h3>

        {subjects.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={32} />

            <h4>No subjects yet</h4>

            <p>
              Add your first subject using the form above.
            </p>
          </div>
        ) : (
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <article className="subject-card" key={subject.id}>
                <div className="subject-card-icon">
                  <BookOpen size={21} />
                </div>

                <div className="subject-card-content">
                  <h4>{subject.name}</h4>

                  <p>Academic subject</p>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  aria-label={`Delete ${subject.name}`}
                  title="Delete subject"
                  onClick={() =>
                    handleDelete(subject.id, subject.name)
                  }
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}