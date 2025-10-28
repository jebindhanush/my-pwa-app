import React, { useEffect, useState } from "react";
import { addNote, getNotes, deleteNote, markSynced } from "../utils/db";

const NotesModal: React.FC = () => {
  const [notes, setNotes] = useState<
    { title: string; content: string; createdAt: number; synced: boolean }[]
  >([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const all = await getNotes();
    setNotes(all.sort((a, b) => b.createdAt - a.createdAt));
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim()) return;
    await addNote({
      ...newNote,
      createdAt: Date.now(),
    });
    setNewNote({ title: "", content: "" });
    loadNotes();

    // Simulate async server sync
    setTimeout(async () => {
      await markSynced(newNote.title);
      loadNotes();
    }, 4000);
  };

  const handleDelete = async (title: string) => {
    await deleteNote(title);
    loadNotes();
  };

  return (
    <>
      <button
        className="btn btn-light mt-4 px-4 py-2 fw-semibold"
        onClick={() => setShow(true)}
      >
        Open Notes 📒
      </button>

      {show && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1055,
          }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div
                className="modal-header bg-primary text-white py-2"
                style={{
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",
                }}
              >
                <h6 className="modal-title fw-semibold">My Notes</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShow(false)}
                ></button>
              </div>

              <div className="modal-body p-3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                  />
                  <textarea
                    className="form-control form-control-sm"
                    placeholder="Content"
                    rows={2}
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote({ ...newNote, content: e.target.value })
                    }
                  ></textarea>
                </div>

                <button
                  className="btn btn-success btn-sm px-3"
                  onClick={handleAddNote}
                >
                  Add
                </button>

                <hr className="my-3" />

                {notes.length === 0 && (
                  <p className="text-muted small text-center">No notes yet.</p>
                )}
                <div className="d-flex flex-column gap-2">
                  {notes.map((note) => (
                    <div
                      key={note.title}
                      className="p-2 rounded-3 border bg-light position-relative note-card"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`badge rounded-circle ${
                              note.synced ? "bg-success" : "bg-danger"
                            }`}
                            style={{ width: "10px", height: "10px" }}
                          ></span>
                          <h6 className="mb-0 text-primary fw-semibold">
                            {note.title}
                          </h6>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(note.title)}
                        >
                          ×
                        </button>
                      </div>

                      <p className="mb-1 small mt-1">{note.content}</p>
                      <small className="text-muted">
                        {new Date(note.createdAt).toLocaleString()}
                        {" • "}
                        {note.synced ? (
                          <span className="text-success">Synced</span>
                        ) : (
                          <span className="text-danger">Not Synced</span>
                        )}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesModal;
