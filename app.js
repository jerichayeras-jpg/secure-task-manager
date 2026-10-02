const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let idCounter = 0;
const generateId = () => `task-${Date.now()}-${idCounter++}`;

function createTaskElement(text) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-task-id', generateId());
    li.setAttribute('data-status', 'pending');

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = text; // SECURITY: Use textContent, NOT innerHTML

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';

    li.append(span, completeBtn, editBtn, removeBtn);
    return li;
}

function addTask() {
    const text = taskInput.value.trim();
    
    if (!text) {
        taskMessage.textContent = 'Task cannot be empty';
        taskMessage.style.display = 'block';
        return;
    }
    
    taskMessage.style.display = 'none';
    taskList.appendChild(createTaskElement(text));
    taskInput.value = '';
    updateTaskCounts();
}

addTaskBtn.addEventListener('click', addTask);

taskList.addEventListener('click', (event) => {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    if (!taskItem) return;

    if (target.classList.contains('complete-btn')) {
        taskItem.classList.toggle('completed');
        const newStatus = taskItem.classList.contains('completed') ? 'completed' : 'pending';
        taskItem.setAttribute('data-status', newStatus);
        updateTaskCounts();
    } 
    else if (target.classList.contains('remove-btn')) {
        taskItem.remove();
        updateTaskCounts();
    } 
    else if (target.classList.contains('edit-btn')) {
        const span = taskItem.querySelector('.task-text');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = span.textContent;
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.textContent = 'Save';
        
        span.replaceWith(input);
        target.replaceWith(saveBtn);
        input.focus();
    } 
    else if (target.classList.contains('save-btn')) {
        const input = taskItem.querySelector('.edit-input');
        const newText = input.value.trim();
        
        if (!newText) {
            taskMessage.textContent = 'Task cannot be empty';
            taskMessage.style.display = 'block';
            return;
        }
        
        taskMessage.style.display = 'none';
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = newText;
        
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        
        input.replaceWith(span);
        target.replaceWith(editBtn);
    }
});

function updateTaskCounts() {
    const tasks = taskList.querySelectorAll('.task-item');
    const total = tasks.length;
    let completed = 0;
    
    tasks.forEach(task => {
        if (task.getAttribute('data-status') === 'completed') completed++;
    });
    
    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = total - completed;
}

updateTaskCounts();

function loadSampleTasks() {
    const samples = ['Task 1', 'Task 2', 'Task 3'];
    const fragment = document.createDocumentFragment(); // REQUIRED
    
    samples.forEach(text => {
        fragment.appendChild(createTaskElement(text));
    });
    
    taskList.appendChild(fragment);
    updateTaskCounts();
}

loadSampleBtn.addEventListener('click', loadSampleTasks);