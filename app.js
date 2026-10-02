// DOM Element Selections
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSampleBtns = document.getElementById('loadSampleBtns');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let taskIdCounter = 1;

// Helper: Create single task element
function createTaskElement(taskText, taskId) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = taskId || `task-${taskIdCounter++}`;
    li.dataset.state = 'pending';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText; // Safe from HTML injection

    const actionDiv = document.createElement('div');
    actionDiv.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';

    actionDiv.appendChild(completeBtn);
    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(removeBtn);

    li.appendChild(span);
    li.appendChild(actionDiv);

    return li;
}

// Add Task Handler
function addTask(text) {
    const trimmedText = text.trim();
    if (!trimmedText) {
        taskMessage.textContent = 'Task cannot be empty';
        return;
    }
    taskMessage.textContent = '';

    const taskElement = createTaskElement(trimmedText);
    taskList.appendChild(taskElement);

    taskInput.value = '';
    updateTaskCounts();
}

// Toggle Task Complete State
function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle('completed');
    const isCompleted = taskItem.classList.contains('completed');
    taskItem.dataset.state = isCompleted ? 'completed' : 'pending';
    updateTaskCounts();
}

// Begin Editing Task
function beginTaskEdit(taskItem) {
    const taskTextSpan = taskItem.querySelector('.task-text');
    const editBtn = taskItem.querySelector('.edit-btn');

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = taskTextSpan.textContent;

    taskTextSpan.replaceWith(input);
    input.focus();
    editBtn.textContent = 'Save';
}

// Save Edited Task
function saveTaskEdit(taskItem) {
    const input = taskItem.querySelector('.edit-input');
    const editBtn = taskItem.querySelector('.edit-btn');
    const trimmedText = input.value.trim();

    if (!trimmedText) {
        taskMessage.textContent = 'Task cannot be empty';
        return;
    }
    taskMessage.textContent = '';

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = trimmedText; // Safe text assignment

    input.replaceWith(span);
    editBtn.textContent = 'Edit';
}

// Remove Task
function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
}

// Update Counts Dynamically
function updateTaskCounts() {
    const items = taskList.querySelectorAll('.task-item');
    const total = items.length;
    let completed = 0;

    items.forEach(item => {
        if (item.dataset.state === 'completed') {
            completed++;
        }
    });

    const pending = total - completed;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// Single Delegated Event Listener for #taskList
function handleTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    if (target.matches('.complete-btn')) {
        toggleTaskComplete(taskItem);
    } else if (target.matches('.edit-btn')) {
        if (target.textContent === 'Edit') {
            beginTaskEdit(taskItem);
        } else if (target.textContent === 'Save') {
            saveTaskEdit(taskItem);
        }
    } else if (target.matches('.remove-btn')) {
        removeTask(taskItem);
    }
}

// Load Sample Tasks using DocumentFragment
function loadSampleTasks() {
    const fragment = document.createDocumentFragment();
    const samples = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    samples.forEach(sampleText => {
        const taskElement = createTaskElement(sampleText);
        fragment.appendChild(taskElement);
    });

    taskList.appendChild(fragment);
    updateTaskCounts();
}

// Event Listeners Setup
addTaskBtn.addEventListener('click', () => {
    addTask(taskInput.value);
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

loadSampleBtns.addEventListener('click', loadSampleTasks);

taskList.addEventListener('click', handleTaskListClick);