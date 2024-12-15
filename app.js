// Select DOM elements
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDeadline = document.getElementById('task-deadline');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const searchBar = document.getElementById('search-bar');
const themeToggleButton = document.getElementById('theme-toggle');

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.forEach(task => createTaskElement(task));
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(taskList.children).map(taskItem => ({
        text: taskItem.querySelector('.task-text').textContent,
        completed: taskItem.classList.contains('completed'),
        category: taskItem.dataset.category,
        priority: taskItem.dataset.priority,
        deadline: taskItem.dataset.deadline
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Create a new task element
function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.dataset.category = task.category;
    taskItem.dataset.priority = task.priority;
    taskItem.dataset.deadline = task.deadline;

    if (task.completed) {
        taskItem.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
        taskItem.classList.toggle('completed');
        saveTasks();
    });

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.classList.add('task-text');

    const categorySpan = document.createElement('span');
    categorySpan.textContent = `[${task.category}] `;
    categorySpan.style.fontWeight = 'bold';

    const prioritySpan = document.createElement('span');
    prioritySpan.textContent = `(${task.priority}) `;
    prioritySpan.classList.add(`priority-${task.priority.toLowerCase()}`);

    if (task.deadline) {
        const deadlineSpan = document.createElement('span');
        const deadlineDate = new Date(task.deadline);
        deadlineSpan.textContent = `Due: ${deadlineDate.toLocaleString()}`;
        deadlineSpan.style.marginLeft = '10px';

        if (deadlineDate < new Date()) {
            taskItem.classList.add('overdue');
            deadlineSpan.style.color = 'red';
        }
        taskText.appendChild(deadlineSpan);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(taskItem);
        saveTasks();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(prioritySpan);
    taskItem.appendChild(categorySpan);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    const taskDeadlineValue = taskDeadline.value;
    const taskCategoryValue = taskCategory.value;
    const taskPriorityValue = taskPriority.value;

    if (taskText) {
        createTaskElement({
            text: taskText,
            completed: false,
            category: taskCategoryValue,
            priority: taskPriorityValue,
            deadline: taskDeadlineValue
        });

        taskInput.value = '';
        taskDeadline.value = '';
        saveTasks();
    }
}

// Toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    themeToggleButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Load theme from local storage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Light Mode';
    } else {
        themeToggleButton.textContent = 'Dark Mode';
    }
}

// Filter tasks by search
searchBar.addEventListener('input', () => {
    const searchValue = searchBar.value.toLowerCase();
    Array.from(taskList.children).forEach(taskItem => {
        const text = taskItem.querySelector('.task-text').textContent.toLowerCase();
        taskItem.style.display = text.includes(searchValue) ? '' : 'none';
    });
});

// Event listeners
addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

themeToggleButton.addEventListener('click', toggleTheme);

// Load tasks on page load
loadTasks();
loadTheme();
