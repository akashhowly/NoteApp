import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes-app-data");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [showPopup, setShowPopup] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-orange-200",
    "bg-amber-200",
    "bg-sky-200",
    "bg-indigo-200",
    "bg-fuchsia-200",
    "bg-emerald-200",
    "bg-lime-200",
    "bg-teal-200",
    "bg-cyan-200",
    "bg-rose-200",
    "bg-violet-200",
  ];

  useEffect(() => {
    localStorage.setItem("notes-app-data", JSON.stringify(notes));
  }, [notes]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (formData.title.trim() === "" || formData.description.trim() === "")
      return;

    if (editNote) {
      const updateNotes = notes.map((note) =>
        note.id === editNote
          ? {
              ...note,
              title: formData.title,
              description: formData.description,
            }
          : note
      );
      setNotes(updateNotes);
      setToast("Note edited successfully");
    } else {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newNote = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        bgColor: randomColor,
      };
      setNotes((prev) => [...prev, newNote]);
      setToast("Note added successfully");
    }

    setFormData({ title: "", description: "" });
    setShowPopup(false);
    setEditNote(null);
    setTimeout(() => setToast(""), 3000);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmDelete) return;
    setNotes(notes.filter((note) => note.id !== id));
    setToast("Note deleted successfully");
    setTimeout(() => setToast(""), 3000);
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function changeNoteColor(id) {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  setNotes((prevNotes) =>
    prevNotes.map((note) =>
      note.id === id ? { ...note, bgColor: randomColor } : note
    )
  );
}


  return (
    <div className="min-h-screen w-screen bg-blue-100">
      <div className="flex">
        <div className="w-full h-full  rounded-2xl">
          <div className="sticky top-0 z-50 bg-blue-100  flex justify-between items-center py-4 px-5 shadow-xs rounded-2xl">
            <div>
              <h1 className="font-bold text-4xl">Notes</h1>
              <input
                  type="text"
                  placeholder="🔍 Search notes by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 border bg-white border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              
            </div>
             <button
                  onClick={() => {
                    setShowPopup(true);
                    setEditNote(null);
                    setFormData({ title: "", description: "" });
                  }}
                  className="h-full bg-black text-white px-4 py-2 rounded-xl shadow-black shadow-2xs hover:scale-105 duration-150 active:scale-95 flex items-center gap-2 mt-9"
                >
                  <span className="text-2xl font-extrabold text-blue-200">
                    +
                  </span>
                  Add Note
                </button>
          </div>

          <div className="ml-15 mt-5 mr-15 p-2 overflow-auto">
            {filteredNotes.length === 0 ? (
              notes.length === 0 ? (
                <p className="text-gray-500">No notes yet! Add a note now!</p>
              ) : (
                <p className="text-gray-500">No matching notes found</p>
              )
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`hover:scale-101 duration-150 p-3 border rounded ${note.bgColor} shadow-xs mb-3`}
                >
                  <div className="w-full">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{note.title}</h3>
                       <button
                      className="ml-2 px-1 p-1 rounded-full text-white hover:scale-125 duration-150 active:scale-95"
                      onClick={() => changeNoteColor(note.id)}
                    >
                      🎨
                    </button>
                    </div>
                    <p>{note.description}</p>
                  </div>
                  <div className="flex justify-end items-end mt-2 gap-1">
                    <button
                      className="bg-blue-600 text-xs p-1 rounded text-white hover:scale-105 duration-150 active:scale-95"
                      onClick={() => {
                        setEditNote(note.id);
                        setFormData({
                          title: note.title,
                          description: note.description,
                        });
                        setShowPopup(true);
                      }}
                    >
                      Edit
                    </button>
                    
                    <button
                      className="ml-2 bg-red-600 text-xs p-1 rounded text-white hover:scale-105 duration-150 active:scale-95"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                   
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-transparent flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-4/5 max-w-md relative">
            <button
              onClick={() => {
                setShowPopup(false);
                setEditNote(null);
                setFormData({ title: "", description: "" });
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editNote ? "Edit Note" : "New Note"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Write title..."
                  className="w-full mt-1 px-3 py-2 border bg-gray-200 border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your note here..."
                  className="w-full mt-1 p-3 border bg-gray-200 border-gray-300 rounded-xl focus:outline-none focus:ring-2"
                />
              </div>
              <button className="bg-black hover:scale-105 duration-150 text-white px-4 py-2 rounded-lg shadow-md active:scale-90">
                {editNote ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 text-white px-4 py-2 rounded shadow-lg animate-bounce z-50 ${
            toast.includes("deleted") ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
