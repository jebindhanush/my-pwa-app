import { openDB, type DBSchema } from "idb";

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: {
      title: string;
      content: string;
      createdAt: number;
      synced: boolean; // new field
    };
  };
}

const dbPromise = openDB<NotesDB>("notes-db", 1, {
  upgrade(db) {
    db.createObjectStore("notes", { keyPath: "title" });
  },
});

export async function addNote(note: {
  title: string;
  content: string;
  createdAt: number;
}) {
  const db = await dbPromise;
  await db.put("notes", { ...note, synced: false }); // default unsynced
}

export async function getNotes() {
  const db = await dbPromise;
  return db.getAll("notes");
}

export async function deleteNote(title: string) {
  const db = await dbPromise;
  await db.delete("notes", title);
}

export async function markSynced(title: string) {
  const db = await dbPromise;
  const note = await db.get("notes", title);
  if (note) {
    note.synced = true;
    await db.put("notes", note);
  }
}
