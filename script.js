/*
  script.js
  Implements the To-Do app logic with localStorage persistence.

  Functions provided:
  - addTask(): Create a new task from the input field and persist it.
  - renderTasks(): Render the tasks list and update UI counters.
  - saveTasks(): Persist tasks array to localStorage.
  - editTask(id): Edit the text of a task and save immediately.
  - toggleTask(id): Toggle the completed state of a task.
  - deleteTask(id): Remove a task from the list and storage.
  - loadTasks(): Load tasks from localStorage on startup.

  The tasks are stored as an array of objects:
  { id: Number, text: String, completed: Boolean }
*/
const STORAGE_KEY = 'tasks';
let tasks = [];

// Add a new task (called from button click or Enter key)
// Create a new task from the input field and persist it.
function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();

  // Prevent adding empty tasks
  if (!text) {
    alert('Please enter a task.');
    return;
  }

  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks();

  // Clear input for better UX
  input.value = '';
  input.focus();
}

// Render the tasks into the DOM
function renderTasks() {
  const list = document.getElementById('task-list');
  const emptyMsg = document.getElementById('empty-msg');
  const totalCount = document.getElementById('total-count');
  const completedCount = document.getElementById('completed-count');
  list.innerHTML = '';

  if (!tasks.length) {
    emptyMsg.style.display = 'block';
    if (totalCount) totalCount.textContent = 'Total: 0';
    if (completedCount) completedCount.textContent = 'Completed: 0';
    return;
  }
  emptyMsg.style.display = 'none';

  // Update counts
  if (totalCount) totalCount.textContent = `Total: ${tasks.length}`;
  if (completedCount) completedCount.textContent = `Completed: ${tasks.filter(t => t.completed).length}`;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    const left = document.createElement('div');
    left.className = 'task-left';

    const textEl = document.createElement('span');
    textEl.className = 'task-text' + (task.completed ? ' completed' : '');
    textEl.textContent = task.text;
    textEl.setAttribute('role', 'textbox');

    left.appendChild(textEl);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));

    const doneBtn = document.createElement('button');
    doneBtn.className = 'action-btn done';
    doneBtn.textContent = task.completed ? 'Undo' : 'Done';
    doneBtn.addEventListener('click', () => toggleTask(task.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(doneBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

// Save tasks array to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Edit a task's text. Uses prompt for simplicity and immediate save.
// Edit the text of an existing task. Uses a prompt for quick editing.
function editTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  const current = tasks[idx].text;

  // Prompt returns null when cancelled
  const updated = prompt('Edit task:', current);
  if (updated === null) return;

  const trimmed = updated.trim();
  if (!trimmed) {
    alert('Task cannot be empty.');
    return;
  }

  tasks[idx].text = trimmed;
  saveTasks();
  renderTasks();
}

// Toggle completed state for a task
// Toggle the completed flag for a task and persist the change.
function toggleTask(id) {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  tasks[idx].completed = !tasks[idx].completed;
  saveTasks();
  renderTasks();
}

// Delete a task by id
// Delete a task by id and update storage/UI.
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Load tasks from localStorage
// Load tasks from localStorage into the `tasks` array.
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load tasks from storage:', e);
    tasks = [];
  }
}

// Setup event listeners and initialize app
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-task-btn');
  const input = document.getElementById('task-input');

  addBtn.addEventListener('click', addTask);

  // Support pressing Enter to add task
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  loadTasks();
  renderTasks();
});
