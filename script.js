

document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    loadTheme();
});

document.getElementById("theme-toggle").addEventListener("click", function () {
    toggleTheme();
})


function toggleTheme() {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    saveTheme();
}

function saveTheme() {
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        document.body.classList.add('light');
    }
}

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let priorityInput = document.getElementById("priorityInput");
    let deadlineInput = document.getElementById("deadlineInput");
    let categoryInput = document.getElementById("categoryInput");
    let taskText = taskInput.value.trim();
    let priority = parseInt(priorityInput.value);
    let deadline = deadlineInput.value;
    let category = categoryInput.value;
    if (!taskText || !priority || !deadline) {
        alert("Du måste fylla i alla fält innan du lägger till en uppgift");
        return;
    }
    const task = {
        text: taskText,
        priority: parseInt(priority),
        deadline: deadline, 
        category: category
    };

    const taskLista = document.getElementById('taskLista');
    const taskItem = document.createElement('li');
    taskItem.innerHTML = `${taskText} <span class="priority">Prioritet: 
        ${getPriorityLabel(task.priority)}</span> <span class ="category">Kategori: ${task.category}</span> <span class="deadline">Deadline: 
        ${new Date(task.deadline).toLocaleString()}</span><button class="complete" 
        onclick="markComplete(this)">Klar</button><button class="remove" onclick="removeTask(this)">Ta bort</button>`;

    taskItem.dataset.priority = priority;
    taskItem.dataset.deadline = deadline;
    taskItem.dataset.category = category;
    taskLista.appendChild(taskItem);

    setTimeout(() => {
        taskItem.classList.add('visible');
    }, 10);
    saveTasks();
    updateProgressBar();

    taskInput.value = '';
    priorityInput.value = '3';
    deadlineInput.value = '';
    categoryInput.value = 'work';
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.ongoing.forEach(task => {
            const taskLista = document.getElementById('taskLista');
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `${task.text} <span class="priority">Prioritet: 
            ${getPriorityLabel(parseInt(task.priority))}</span> <span class ="category">Kategori: ${task.category}</span> <span class="deadline">Deadline: 
            ${new Date(task.deadline).toLocaleString()}</span><button class="complete" onclick="markComplete(this)">Klar</button>
            <button class="remove" onclick="removeTask(this)">Ta bort</button>`;
            taskItem.dataset.priority = task.priority;
            taskItem.dataset.deadline = task.deadline;
            taskItem.dataset.category = task.category;
            taskLista.appendChild(taskItem);

            setTimeout(() => {
                taskItem.classList.add('visible')
            }, 10);
        });
        tasks.completed.forEach(task => {
            const completedList = document.getElementById('completedList');
            const completedTask = document.createElement('li');
            completedTask.innerHTML = `${task.text} <span class="priority">Prioritet: 
            ${getPriorityLabel(parseInt(task.priority))}</span> <span class ="category">Kategori: ${task.category}</span> <span class="deadline">Deadline: 
            ${new Date(task.deadline).toLocaleString()}</span><button class="remove" onclick="removeTask(this)">Ta bort</button>`;
            completedTask.dataset.priority = task.priority;
            completedTask.dataset.deadline = task.deadline;
            completedList.appendChild(completedTask);

            setTimeout(() => {
                completedTask.classList.add('visible');
            }, 10)

        });
        updateProgressBar();
    }
}

function getPriorityLabel(priority) {
    switch (priority) {
        case 1: return 'Hög';
        case 2: return 'Mellan';
        case 3: return 'Låg';
        default: return 'Okänd';
    }
}

function clearAll() {
    if (confirm("Är du säker på att du vill rensa alla pågående och avklarade uppgifter?")) {
        document.getElementById("taskLista").innerHTML = '';
        document.getElementById("completedList").innerHTML = '';
        localStorage.removeItem("tasks");
        saveTasks();
    }
}

function markComplete(button) {
    taskItem = button.parentElement;
    completedList = document.getElementById('completedList');
    taskText = taskItem.childNodes[0].textContent.trim();
    priority = taskItem.dataset.priority;
    deadline = taskItem.dataset.deadline;

    const completedTask = document.createElement('li');
    completedTask.innerHTML = `${taskText} <span class="priority">Prioritet: ${getPriorityLabel(parseInt(priority))}</span> <span class="deadline">Deadline: ${new Date(deadline).toLocaleString()}</span><button class="remove" onclick="removeTask(this)">Ta bort</button>`;

    completedTask.dataset.priority = priority;
    completedTask.dataset.deadline = deadline;

    taskItem.classList.add('fade');

    setTimeout(() => {
        completedList.appendChild(completedTask);
        completedTask.classList.add('visible');
        taskItem.remove();
        saveTasks();
        updateProgressBar();
    }, 300);

}

function removeTask(button) {
    const taskItem = button.parentElement;

    taskItem.classList.add('fade');
    setTimeout(() => {
        taskItem.remove();
        saveTasks();
    }, 300);

}
function saveTasks() {
    let tasks = { ongoing: [], completed: [] };

    document.querySelectorAll("#taskLista li").forEach(li => {
        tasks.ongoing.push({
            text: li.firstChild.textContent.trim(),
            priority: parseInt(li.dataset.priority),
            deadline: li.dataset.deadline,
            category: li.dataset.category,
        });
    });

    document.querySelectorAll("#completedList li").forEach(li => {
        tasks.completed.push({
            text: li.firstChild.textContent.trim(),
            priority: li.dataset.priority, deadline: li.dataset.deadline,
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgressBar();
}

function updateProgressBar() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const totalTasks = tasks ? tasks.ongoing.length + tasks.completed.length : 0;
    const completedTasks = tasks ? tasks.completed.length : 0;

    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").innerText = `${Math.round(progress)}%`;

}













