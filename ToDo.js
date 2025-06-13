const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const calendarBtn = document.getElementById('calendarBtn');
const taskList = document.getElementById('taskList');
const pendingTasksText = document.getElementById('pendingTasks');
const clearAllBtn = document.getElementById('clearAllBtn');
const dateModal = document.getElementById('dateModal');
const dueDateInput = document.getElementById('dueDateInput');
const confirmDateBtn = document.getElementById('confirmDateBtn');
const cancelDateBtn = document.getElementById('cancelDateBtn');
const closeModal = document.querySelector('.close');

let tasks = [];
let selectedDueDate = null;

function updateTaskCount() {
  const pending = tasks.filter(task => !task.completed).length;
  pendingTasksText.textContent = `You have ${pending} pending task${pending !== 1 ? 's' : ''}.`;
}

function calculateDaysLeft(dueDate) {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function formatDaysLeft(daysLeft) {
  if (daysLeft < 0) {
    return `${Math.abs(daysLeft)} days overdue`;
  } else if (daysLeft === 0) {
    return 'Due today';
  } else if (daysLeft === 1) {
    return '1 day left';
  } else {
    return `${daysLeft} days left`;
  }
}

function getTimeClass(daysLeft) {
  if (daysLeft < 0) {
    return 'overdue';
  } else if (daysLeft <= 3) {
    return 'soon';
  } else {
    return 'later';
  }
}

function createTaskElement(task, index) {
  const li = document.createElement('li');
  li.className = `task ${task.completed ? 'completed' : ''}`;

  const leftDiv = document.createElement('div');
  leftDiv.className = 'left';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    renderTasks();
  });

  const taskText = document.createElement('span');
  taskText.className = 'text';
  taskText.textContent = task.text;

  const timeLeft = document.createElement('span');
  timeLeft.className = 'time';
  const daysLeft = calculateDaysLeft(task.dueDate);
  timeLeft.textContent = formatDaysLeft(daysLeft);
  timeLeft.classList.add(getTimeClass(daysLeft));

  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(taskText);
  leftDiv.appendChild(timeLeft);

  const actions = document.createElement('div');
  actions.className = 'actions';

  const editBtn = document.createElement('button');
  editBtn.innerHTML = '✎';
  editBtn.title = 'Edit task';
  editBtn.addEventListener('click', () => {
    const newTask = prompt('Edit task:', task.text);
    if (newTask !== null && newTask.trim() !== '') {
      task.text = newTask.trim();
      renderTasks();
    }
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '✕';
  deleteBtn.title = 'Delete task';
  deleteBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this task?')) {
      tasks.splice(index, 1);
      renderTasks();
    }
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(leftDiv);
  li.appendChild(actions);

  return li;
}

function renderTasks() {
  taskList.innerHTML = '';
  
  const sortedTasks = [...tasks].sort((a, b) => {
    const daysA = calculateDaysLeft(a.dueDate);
    const daysB = calculateDaysLeft(b.dueDate);
    return daysA - daysB;
  });
  
  sortedTasks.forEach((task, index) => {
    const originalIndex = tasks.indexOf(task);
    const taskEl = createTaskElement(task, originalIndex);
    taskList.appendChild(taskEl);
  });
  updateTaskCount();
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText && selectedDueDate) {
    tasks.push({ 
      text: taskText, 
      completed: false, 
      dueDate: selectedDueDate 
    });
    taskInput.value = '';
    selectedDueDate = null;
    renderTasks();
  } else if (taskText && !selectedDueDate) {
    alert('Please select a due date for the task.');
  }
}

function openDateModal() {
  const today = new Date().toISOString().split('T')[0];
  dueDateInput.min = today;
  dueDateInput.value = today;
  dateModal.style.display = 'block';
}

function closeDateModal() {
  dateModal.style.display = 'none';
}

function confirmDate() {
  if (dueDateInput.value) {
    selectedDueDate = dueDateInput.value;
    closeDateModal();
    // Visual feedback that date is selected
    calendarBtn.style.background = '#10b981';
    setTimeout(() => {
      calendarBtn.style.background = '#4f46e5';
    }, 1000);
  }
}

addTaskBtn.addEventListener('click', addTask);
calendarBtn.addEventListener('click', openDateModal);
confirmDateBtn.addEventListener('click', confirmDate);
cancelDateBtn.addEventListener('click', closeDateModal);
closeModal.addEventListener('click', closeDateModal);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

clearAllBtn.addEventListener('click', () => {
  if (tasks.length > 0 && confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    selectedDueDate = null;
    renderTasks();
  }
});

window.addEventListener('click', (e) => {
  if (e.target === dateModal) {
    closeDateModal();
  }
});

renderTasks();
