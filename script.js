const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const count = document.getElementById('todo-count');
const clearCompleted = document.getElementById('clear-completed');
const navLinks = document.querySelectorAll('.nav-link');

let todos = [];
let currentFilter = 'all';

function updateCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  const total = todos.length;
  
  if (currentFilter === 'all') {
    count.textContent = `${remaining} of ${total} tasks remaining`;
  } else if (currentFilter === 'active') {
    count.textContent = `${remaining} active tasks`;
  } else if (currentFilter === 'completed') {
    const completed = total - remaining;
    count.textContent = `${completed} completed tasks`;
  }
}

function saveTodos() {
  localStorage.setItem('todo-items', JSON.stringify(todos));
}

function loadTodos() {
  const stored = localStorage.getItem('todo-items');
  todos = stored ? JSON.parse(stored) : [];
}

function renderTodos(filter = 'all') {
  list.innerHTML = '';

  let filteredTodos = todos;
  if (filter === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (filter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  if (filteredTodos.length === 0) {
    const emptyState = document.createElement('li');
    if (filter === 'all' && todos.length === 0) {
      emptyState.textContent = 'No tasks yet. Add one to get started.';
    } else if (filter === 'active') {
      emptyState.textContent = 'No active tasks.';
    } else if (filter === 'completed') {
      emptyState.textContent = 'No completed tasks.';
    }
    emptyState.className = 'todo-item';
    list.appendChild(emptyState);
  }

  filteredTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''} animate-slide-in`;

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
      renderTodos(currentFilter);
      // Add strike animation for completion
      if (todo.completed) {
        const taskText = item.querySelector('.task-text');
        taskText.classList.add('strike-animation');
      }
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      item.classList.add('animate-slide-out');
      item.addEventListener('animationend', () => {
        todos = todos.filter((t) => t.id !== todo.id);
        saveTodos();
        renderTodos(currentFilter);
      }, { once: true });
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
  renderTodos(currentFilter);
});

clearCompleted.addEventListener('click', () => {
  const completedItems = list.querySelectorAll('.todo-item.completed');
  let animationsCompleted = 0;

  if (completedItems.length === 0) return;

  completedItems.forEach((item) => {
    item.classList.add('animate-slide-out');
    item.addEventListener('animationend', () => {
      animationsCompleted++;
      if (animationsCompleted === completedItems.length) {
        todos = todos.filter((todo) => !todo.completed);
        saveTodos();
        renderTodos(currentFilter);
      }
    }, { once: true });
  });
});

// Navbar filter functionality
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = e.target.dataset.filter;
    
    if (filter === 'about') {
      // Handle about section - could show a modal or redirect
      alert('Todo App - A simple task management application');
      return;
    }
    
    // Update active nav link
    navLinks.forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');
    
    // Update current filter and re-render
    currentFilter = filter;
    renderTodos(currentFilter);
  });
});

loadTodos();
renderTodos(currentFilter);
