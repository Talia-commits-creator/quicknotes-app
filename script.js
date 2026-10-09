const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const category = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function saveNotes() {
  localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function render() {
  notesList.replaceChildren();

  const search = searchInput.value.toLowerCase();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(search),
  );

  if (filteredNotes.length === 0 && search !== "") {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
  }

  filteredNotes.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note", `category-${note.category}`);

    const text = document.createElement("p");
    text.textContent = note.text;

    const label = document.createElement("span");
    label.className = "category-label";
    label.textContent = note.category;

    const date = document.createElement("span");
    date.className = "note-date";
    date.textContent = note.createdAt;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      saveNotes();
      render();
    });

    li.append(text, label, date, deleteButton);
    notesList.appendChild(li);
  });

  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text.length === 0) {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const note = {
    id: Date.now(),
    text: text,
    category: category.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(note);
  saveNotes();

  input.value = "";
  render();
});

searchInput.addEventListener("input", render);

render();
