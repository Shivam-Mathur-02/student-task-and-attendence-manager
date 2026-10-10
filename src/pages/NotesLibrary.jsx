import { useEffect, useState } from "react";
import {
  Upload,
  Download,
  Trash2,
  FileText,
  FolderOpen,
  BookOpen,
} from "lucide-react";

import { subjectService, notesService } from "../services/api";

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotesLibrary() {
  const [subjects] = useState(() => subjectService.getAll());

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [subjectId, setSubjectId] = useState("");
  const [unit, setUnit] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadNotes() {
    try {
      const savedNotes = await notesService.getAll();
      setNotes(savedNotes);
    } catch (err) {
      setError(err.message || "Unable to load notes.");
    } finally {
      setLoading(false);
    }
  }

  // Load notes when the page opens.
  // The promise callback updates state asynchronously.
  useEffect(() => {
  let cancelled = false;

  async function fetchNotes() {
    try {
      const savedNotes = await notesService.getAll();

      if (!cancelled) {
        setNotes(savedNotes);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Unable to load notes.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void fetchNotes();

  return () => {
    cancelled = true;
  };
    }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!file) {
      setError("Select a file to upload.");
      return;
    }

    setBusy(true);

    try {
      await notesService.create({
        title,
        unit,
        subjectId,
        description,
        file,
      });

      await loadNotes();

      setTitle("");
      setUnit("");
      setDescription("");
      setFile(null);

      const fileInput = document.getElementById("note-file");

      if (fileInput) {
        fileInput.value = "";
      }

      setSuccess("Note uploaded successfully.");
    } catch (err) {
      setError(err.message || "Unable to upload note.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload(note) {
    setError("");
    setSuccess("");

    try {
      await notesService.download(note.id);
      setSuccess(`Downloading ${note.fileName}.`);
    } catch (err) {
      setError(err.message || "Unable to download note.");
    }
  }

  async function handleDelete(note) {
    const confirmed = window.confirm(
      `Delete "${note.title}" and its uploaded file?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await notesService.delete(note.id);
      await loadNotes();

      setSuccess("Note deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete note.");
    }
  }

  const availableUnits = [
    ...new Set(
      notes
        .filter(
          (note) =>
            selectedSubject === "all" ||
            note.subjectId === selectedSubject,
        )
        .map((note) => note.unit),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const filteredNotes = notes.filter((note) => {
    const matchesSubject =
      selectedSubject === "all" ||
      note.subjectId === selectedSubject;

    const matchesUnit =
      selectedUnit === "all" || note.unit === selectedUnit;

    return matchesSubject && matchesUnit;
  });

  const groupedNotes = filteredNotes.reduce((groups, note) => {
    const subjectName =
      subjects.find((subject) => subject.id === note.subjectId)
        ?.name || "Unknown Subject";

    if (!groups[subjectName]) {
      groups[subjectName] = {};
    }

    if (!groups[subjectName][note.unit]) {
      groups[subjectName][note.unit] = [];
    }

    groups[subjectName][note.unit].push(note);

    return groups;
  }, {});

  return (
    <div className="notes-page">
      <section className="page-intro">
        <div>
          <h2>Notes Library</h2>
          <p>Organize your study materials subject by subject.</p>
        </div>

        <span className="subject-count">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </section>

      <section className="content-panel notes-upload-panel">
        <h3>Upload Study Material</h3>

        {subjects.length === 0 ? (
          <p className="empty-message">
            Add a subject before uploading study materials.
          </p>
        ) : (
          <form className="notes-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="note-subject">Subject</label>

              <select
                id="note-subject"
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                required
              >
                <option value="">Select a subject</option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="note-unit">Unit</label>

              <input
                id="note-unit"
                type="text"
                placeholder="e.g. Unit 1 - Introduction"
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div className="form-field notes-title-field">
              <label htmlFor="note-title">Note title</label>

              <input
                id="note-title"
                type="text"
                placeholder="e.g. Three Schema Architecture"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={150}
                required
              />
            </div>

            <div className="form-field notes-description-field">
              <label htmlFor="note-description">
                Description (optional)
              </label>

              <textarea
                id="note-description"
                rows="2"
                placeholder="What does this material cover?"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                maxLength={1000}
              />
            </div>

            <div className="form-field notes-file-field">
              <label htmlFor="note-file">Select file (maximum 10 MB)</label>

              <input
                id="note-file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                onChange={(event) =>
                  setFile(event.target.files?.[0] || null)
                }
                required
              />

              {file && (
                <span className="selected-file">
                  {file.name} · {formatFileSize(file.size)}
                </span>
              )}
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

            <button
              className="primary-button"
              type="submit"
              disabled={busy}
            >
              <Upload size={17} />
              {busy ? "Uploading..." : "Upload Note"}
            </button>
          </form>
        )}
      </section>

      <section className="notes-library-section">
        <div className="notes-library-heading">
          <h3>My Study Materials</h3>

          <div className="notes-filters">
            <select
              aria-label="Filter notes by subject"
              value={selectedSubject}
              onChange={(event) => {
                setSelectedSubject(event.target.value);
                setSelectedUnit("all");
              }}
            >
              <option value="all">All subjects</option>

              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter notes by unit"
              value={selectedUnit}
              onChange={(event) => setSelectedUnit(event.target.value)}
            >
              <option value="all">All units</option>

              {availableUnits.map((unitName) => (
                <option key={unitName} value={unitName}>
                  {unitName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="empty-message">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={32} />

            <h4>No study materials found</h4>

            <p>
              Upload your first note using the form above.
            </p>
          </div>
        ) : (
          <div className="notes-groups">
            {Object.entries(groupedNotes).map(
              ([subjectName, units]) => (
                <section
                  className="notes-subject-group"
                  key={subjectName}
                >
                  <h4 className="notes-subject-heading">
                    <BookOpen size={18} />
                    {subjectName}
                  </h4>

                  {Object.entries(units).map(
                    ([unitName, unitNotes]) => (
                      <div className="notes-unit-group" key={unitName}>
                        <h5>{unitName}</h5>

                        <div className="notes-list">
                          {unitNotes.map((note) => (
                            <article
                              className="note-card"
                              key={note.id}
                            >
                              <div className="note-file-icon">
                                <FileText size={20} />
                              </div>

                              <div className="note-card-content">
                                <h6>{note.title}</h6>

                                {note.description && (
                                  <p>{note.description}</p>
                                )}

                                <span className="note-file-meta">
                                  {note.fileName}
                                  {" · "}
                                  {formatFileSize(note.fileSize)}
                                  {" · "}
                                  {formatDate(note.createdAt)}
                                </span>
                              </div>

                              <div className="note-actions">
                                <button
                                  type="button"
                                  className="delete-button"
                                  onClick={() => handleDownload(note)}
                                  aria-label={`Download ${note.title}`}
                                  title="Download note"
                                >
                                  <Download size={17} />
                                </button>

                                <button
                                  type="button"
                                  className="delete-button"
                                  onClick={() => handleDelete(note)}
                                  aria-label={`Delete ${note.title}`}
                                  title="Delete note"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>
                            </article>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </section>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}