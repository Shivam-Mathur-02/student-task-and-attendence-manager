import { useState } from "react";
import {
  ClipboardCheck,
  AlertTriangle,
  Save,
} from "lucide-react";

import {
  subjectService,
  attendanceService,
} from "../services/api";

const ATTENDANCE_THRESHOLD = 75;

function calculatePercentage(attended, total) {
  if (total === 0) {
    return 0;
  }

  return Math.round((attended / total) * 100);
}

export default function Attendance() {
  const [subjects] = useState(() => subjectService.getAll());

  const [records, setRecords] = useState(() =>
    attendanceService.getAll(),
  );

  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [attended, setAttended] = useState("");
  const [total, setTotal] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubjectChange(event) {
    const subjectId = event.target.value;

    setSelectedSubjectId(subjectId);
    setError("");
    setSuccess("");

    const existingRecord = records.find(
      (record) => record.subjectId === subjectId,
    );

    setAttended(
      existingRecord ? String(existingRecord.attended) : "",
    );

    setTotal(
      existingRecord ? String(existingRecord.total) : "",
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedSubjectId) {
      setError("Please select a subject.");
      return;
    }

    if (attended.trim() === "" || total.trim() === "") {
      setError("Enter both attended and total classes.");
      return;
    }

    const attendedCount = Number(attended);
    const totalCount = Number(total);

    if (
      !Number.isInteger(attendedCount) ||
      !Number.isInteger(totalCount)
    ) {
      setError("Class counts must be whole numbers.");
      return;
    }

    if (attendedCount < 0 || totalCount < 0) {
      setError("Class counts cannot be negative.");
      return;
    }

    if (attendedCount > totalCount) {
      setError(
        "Attended classes cannot exceed total classes.",
      );
      return;
    }

    try {
      attendanceService.save(
        selectedSubjectId,
        attendedCount,
        totalCount,
      );

      setRecords(attendanceService.getAll());
      setSuccess("Attendance saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save attendance.");
    }
  }

  const subjectRecords = subjects.map((subject) => {
    const record = records.find(
      (item) => item.subjectId === subject.id,
    );

    const attendedCount = record?.attended ?? 0;
    const totalCount = record?.total ?? 0;

    return {
      ...subject,
      attended: attendedCount,
      total: totalCount,
      percentage: calculatePercentage(
        attendedCount,
        totalCount,
      ),
      hasRecord: Boolean(record),
    };
  });

  const totalClasses = subjectRecords.reduce(
    (sum, subject) => sum + subject.total,
    0,
  );

  const totalAttended = subjectRecords.reduce(
    (sum, subject) => sum + subject.attended,
    0,
  );

  const overallPercentage = calculatePercentage(
    totalAttended,
    totalClasses,
  );

  return (
    <div className="attendance-page">
      <section className="page-intro">
        <div>
          <h2>Attendance Management</h2>
          <p>
            Track attendance and monitor your academic progress.
          </p>
        </div>
      </section>

      <section className="attendance-summary">
        <article className="attendance-summary-card">
          <span>Total Classes</span>
          <strong>{totalClasses}</strong>
        </article>

        <article className="attendance-summary-card">
          <span>Classes Attended</span>
          <strong>{totalAttended}</strong>
        </article>

        <article className="attendance-summary-card">
          <span>Overall Attendance</span>
          <strong>{overallPercentage}%</strong>
        </article>
      </section>

      <section className="content-panel attendance-form-panel">
        <h3>Update Attendance</h3>

        {subjects.length === 0 ? (
          <p className="empty-message">
            Add a subject before recording attendance.
          </p>
        ) : (
          <form
            className="attendance-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="attendance-subject">
                Subject
              </label>

              <select
                id="attendance-subject"
                value={selectedSubjectId}
                onChange={handleSubjectChange}
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
              <label htmlFor="attended-classes">
                Classes Attended
              </label>

              <input
                id="attended-classes"
                type="number"
                min="0"
                step="1"
                value={attended}
                onChange={(event) =>
                  setAttended(event.target.value)
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="total-classes">
                Total Classes
              </label>

              <input
                id="total-classes"
                type="number"
                min="0"
                step="1"
                value={total}
                onChange={(event) =>
                  setTotal(event.target.value)
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
              <Save size={17} />
              Save Attendance
            </button>
          </form>
        )}
      </section>

      <section className="attendance-records-section">
        <h3>Subject Attendance</h3>

        {subjectRecords.length === 0 ? (
          <div className="empty-state">
            <ClipboardCheck size={30} />
            <h4>No subjects available</h4>
            <p>Create a subject to start tracking attendance.</p>
          </div>
        ) : (
          <div className="attendance-records">
            {subjectRecords.map((subject) => {
              const isLow =
                subject.hasRecord &&
                subject.percentage < ATTENDANCE_THRESHOLD;

              return (
                <article
                  className="attendance-record-card"
                  key={subject.id}
                >
                  <div className="attendance-record-heading">
                    <div>
                      <h4>{subject.name}</h4>

                      <p>
                        {subject.attended} of {subject.total}{" "}
                        classes attended
                      </p>
                    </div>

                    <strong
                      className={
                        isLow ? "attendance-low" : ""
                      }
                    >
                      {subject.percentage}%
                    </strong>
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

                  {isLow && (
                    <p className="attendance-warning">
                      <AlertTriangle size={15} />
                      Attendance is below 75%.
                    </p>
                  )}

                  {!subject.hasRecord && (
                    <p className="attendance-not-recorded">
                      No attendance record saved yet.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}