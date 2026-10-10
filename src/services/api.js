const SUBJECTS_KEY = "student-task-manager-subjects";

function readSubjects() {
  try {
    const stored = localStorage.getItem(SUBJECTS_KEY);

    if (!stored) {
      return [];
    }

    const subjects = JSON.parse(stored);

    return Array.isArray(subjects) ? subjects : [];
  } catch (error) {
    console.error("Failed to read subjects:", error);
    return [];
  }
}

function saveSubjects(subjects) {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
}

export const subjectService = {
  getAll() {
    return readSubjects();
  },

  create(subjectName) {
    const name = subjectName.trim();

    if (!name) {
      throw new Error("Subject name is required.");
    }

    const subjects = readSubjects();

    const duplicate = subjects.some(
      (subject) =>
        subject.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      throw new Error("This subject already exists.");
    }

    const newSubject = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
    };

    const updatedSubjects = [...subjects, newSubject];

    saveSubjects(updatedSubjects);

    return newSubject;
  },

  delete(subjectId) {
    const subjects = readSubjects();

    const updatedSubjects = subjects.filter(
      (subject) => subject.id !== subjectId,
    );

    saveSubjects(updatedSubjects);

    return updatedSubjects;
  },
};


/*=====================================================
             subjectService
=======================================================*/

const ATTENDANCE_KEY = "student-task-manager-attendance";

function readAttendance() {
  try {
    const stored = localStorage.getItem(ATTENDANCE_KEY);

    if (!stored) {
      return [];
    }

    const records = JSON.parse(stored);

    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error("Failed to read attendance:", error);
    return [];
  }
}

function saveAttendance(records) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
}

export const attendanceService = {
  getAll() {
    return readAttendance();
  },

  save(subjectId, attended, total) {
    if (!Number.isInteger(attended) || !Number.isInteger(total)) {
      throw new Error("Class counts must be whole numbers.");
    }

    if (attended < 0 || total < 0) {
      throw new Error("Class counts cannot be negative.");
    }

    if (attended > total) {
      throw new Error(
        "Attended classes cannot exceed total classes.",
      );
    }

    const records = readAttendance();

    const updatedRecord = {
      subjectId,
      attended,
      total,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = records.findIndex(
      (record) => record.subjectId === subjectId,
    );

    let updatedRecords;

    if (existingIndex >= 0) {
      updatedRecords = records.map((record, index) =>
        index === existingIndex ? updatedRecord : record,
      );
    } else {
      updatedRecords = [...records, updatedRecord];
    }

    saveAttendance(updatedRecords);

    return updatedRecord;
  },

  delete(subjectId) {
    const updatedRecords = readAttendance().filter(
      (record) => record.subjectId !== subjectId,
    );

    saveAttendance(updatedRecords);

    return updatedRecords;
  },
};


/*====================================================
                 TaskKeys
====================================================*/
               
const TASKS_KEY = "student-task-manager-tasks";

function readTasks() {
  try {
    const stored = localStorage.getItem(TASKS_KEY);

    if (!stored) {
      return [];
    }

    const tasks = JSON.parse(stored);

    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error("Failed to read tasks:", error);
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export const taskService = {
  getAll() {
    return readTasks();
  },

  create(taskData) {
    const title = taskData.title.trim();

    if (!title) {
      throw new Error("Task title is required.");
    }

    const validPriorities = ["Low", "Medium", "High"];

    if (!validPriorities.includes(taskData.priority)) {
      throw new Error("Select a valid task priority.");
    }

    const tasks = readTasks();

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description: taskData.description.trim(),
      subjectId: taskData.subjectId || null,
      dueDate: taskData.dueDate || "",
      priority: taskData.priority,
      completed: false,
      ownerId: "local-student",
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];

    saveTasks(updatedTasks);

    return newTask;
  },

  update(taskId, changes) {
    const tasks = readTasks();

    const existingTask = tasks.find(
      (task) => task.id === taskId,
    );

    if (!existingTask) {
      throw new Error("Task not found.");
    }

    const updatedTask = {
      ...existingTask,
      ...changes,
      id: existingTask.id,
      ownerId: existingTask.ownerId,
    };

    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? updatedTask : task,
    );

    saveTasks(updatedTasks);

    return updatedTask;
  },

  delete(taskId) {
    const updatedTasks = readTasks().filter(
      (task) => task.id !== taskId,
    );

    saveTasks(updatedTasks);

    return updatedTasks;
  },
};

/*=======================================================
               NotesLibrary
               Notes Library storage using IndexedDB.
=============================================================*/



const NOTES_DB_NAME = "student-task-manager-notes";
const NOTES_STORE_NAME = "notes";

function openNotesDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Your browser does not support IndexedDB."));
      return;
    }

    const request = indexedDB.open(NOTES_DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(NOTES_STORE_NAME)) {
        const store = database.createObjectStore(
          NOTES_STORE_NAME,
          { keyPath: "id" },
        );

        store.createIndex("subjectId", "subjectId", {
          unique: false,
        });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      reject(
        request.error || new Error("Unable to open notes storage."),
      );
    };
  });
}

export const notesService = {
  async getAll() {
    const database = await openNotesDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        NOTES_STORE_NAME,
        "readonly",
      );

      const request = transaction
        .objectStore(NOTES_STORE_NAME)
        .getAll();

      request.onsuccess = () => {
        resolve(
          request.result.sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt),
          ),
        );
      };

      request.onerror = () => {
        reject(
          request.error || new Error("Unable to load notes."),
        );
      };

      transaction.oncomplete = () => database.close();
      transaction.onerror = () => database.close();
    });
  },

  async create(noteData) {
    const title = noteData.title.trim();
    const unit = noteData.unit.trim();

    if (!title) {
      throw new Error("Note title is required.");
    }

    if (!unit) {
      throw new Error("Unit name is required.");
    }

    if (!noteData.subjectId) {
      throw new Error("Select a subject.");
    }

    if (!(noteData.file instanceof File)) {
      throw new Error("Select a file to upload.");
    }

    const file = noteData.file;

    if (file.size === 0) {
      throw new Error("The selected file is empty.");
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size must not exceed 10 MB.");
    }

    const allowedExtensions = [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "txt",
      "jpg",
      "jpeg",
      "png",
    ];

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      throw new Error("This file type is not supported.");
    }

    const database = await openNotesDatabase();

    const note = {
      id: crypto.randomUUID(),
      title,
      unit,
      subjectId: noteData.subjectId,
      description: noteData.description.trim(),
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSize: file.size,
      file,
      createdAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        NOTES_STORE_NAME,
        "readwrite",
      );

      transaction.objectStore(NOTES_STORE_NAME).add(note);

      transaction.oncomplete = () => {
        database.close();

        const { file: storedFile, ...metadata } = note;
        void storedFile;

        resolve(metadata);
      };

      transaction.onerror = () => {
        const error =
          transaction.error || new Error("Unable to save note.");

        database.close();
        reject(error);
      };

      transaction.onabort = () => {
        const error =
          transaction.error || new Error("Saving the note was aborted.");

        database.close();
        reject(error);
      };
    });
  },

  async download(noteId) {
    const database = await openNotesDatabase();

    const note = await new Promise((resolve, reject) => {
      const transaction = database.transaction(
        NOTES_STORE_NAME,
        "readonly",
      );

      const request = transaction
        .objectStore(NOTES_STORE_NAME)
        .get(noteId);

      request.onsuccess = () => resolve(request.result || null);

      request.onerror = () => {
        reject(
          request.error || new Error("Unable to retrieve the note."),
        );
      };

      transaction.oncomplete = () => database.close();
      transaction.onerror = () => database.close();
    });

    if (!note) {
      throw new Error("Note not found.");
    }

    const url = URL.createObjectURL(note.file);

    const link = document.createElement("a");

    link.href = url;
    link.download = note.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  async delete(noteId) {
    const database = await openNotesDatabase();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(
        NOTES_STORE_NAME,
        "readwrite",
      );

      transaction.objectStore(NOTES_STORE_NAME).delete(noteId);

      transaction.oncomplete = () => {
        database.close();
        resolve(true);
      };

      transaction.onerror = () => {
        const error =
          transaction.error || new Error("Unable to delete note.");

        database.close();
        reject(error);
      };

      transaction.onabort = () => {
        const error =
          transaction.error || new Error("Deleting the note was aborted.");

        database.close();
        reject(error);
      };
    });
  },
};


/*========================================================
// Temporary local assignment-sharing service.
// This supports prototype testing in the current browser only.
*/
const SHARES_KEY = "student-task-manager-shares";

function readShares() {
  try {
    const stored = localStorage.getItem(SHARES_KEY);

    if (!stored) {
      return [];
    }

    const shares = JSON.parse(stored);

    return Array.isArray(shares) ? shares : [];
  } catch (error) {
    console.error("Failed to read shared assignments:", error);
    return [];
  }
}

function saveShares(shares) {
  localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
}

export const sharingService = {
  getAll() {
    return readShares();
  },

  create(task, recipientEmail) {
    const email = recipientEmail.trim().toLowerCase();

    if (!task || !task.id) {
      throw new Error("Select a valid assignment.");
    }

    if (!email) {
      throw new Error("Recipient email is required.");
    }

    const shares = readShares();

    const duplicate = shares.some(
      (share) =>
        share.taskId === task.id &&
        share.recipientEmail === email,
    );

    if (duplicate) {
      throw new Error(
        "This assignment has already been shared with this recipient.",
      );
    }

    const share = {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      description: task.description || "",
      subjectId: task.subjectId || null,
      dueDate: task.dueDate || "",
      priority: task.priority || "Medium",
      senderId: "local-student",
      recipientEmail: email,
      recipientId: null,
      recipientCompleted: false,
      createdAt: new Date().toISOString(),
    };

    saveShares([...shares, share]);

    return share;
  },

  updateRecipientStatus(shareId, completed) {
    const shares = readShares();

    const updatedShares = shares.map((share) =>
      share.id === shareId
        ? { ...share, recipientCompleted: completed }
        : share,
    );

    saveShares(updatedShares);

    return updatedShares;
  },

  delete(shareId) {
    const updatedShares = readShares().filter(
      (share) => share.id !== shareId,
    );

    saveShares(updatedShares);

    return updatedShares;
  },
};