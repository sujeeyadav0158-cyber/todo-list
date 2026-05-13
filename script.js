const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const count = document.getElementById('todo-count');
const clearCompleted = document.getElementById('clear-completed');

let todos = [];

function updateCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;
}

function saveTodos() {
  localStorage.setItem('todo-items', JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem('todo-items');
  todos = stored ? JSON.parse(stored) : [];
}

function renderTodos() {
  list.innerHTML = '';

  if (todos.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.textContent = 'No tasks yet. Add one to get started.';
    emptyState.className = 'todo-item';
    list.appendChild(emptyState);
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;

    const text = document.createElement('p');
    text.className = 'task-text';
    text.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = todo.completed ? 'Undo' : 'Done';
    toggleButton.addEventListener('click', () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      todos = todos.filter((item) => item.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    actions.append(toggleButton, removeButton);
    item.append(text, actions);
    list.appendChild(item);
  });

  updateCount();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now().toString(),
    text,
    completed: false,
  });

  input.value = '';
  saveTodos();
  renderTodos();
});

clearCompleted.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

loadTodos();
renderTodos();
