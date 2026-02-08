console.log("TaskTrack JS loaded");
const taskInput = document.querySelector('.task-input input');
const addTaskButton = document.querySelector('.task-input button');
const taskList = document.querySelector('.task-list ul');
const summaryText = document.querySelector('.task-summary p')
const greeting = document.querySelector('.greeting');
const setNameBtn = document.querySelector('.set-name');
const emptyState = document.querySelector('.empty-state')

function loadUser() {
  const savedName = localStorage.getItem('username');

  if (savedName) {
    greeting.textContent = `Hi, ${savedName} 👋`;
  setNameBtn.textContent = 'Change name';
  }
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll('.task-list li').forEach((li) => {
    const text = li.querySelector('span').textContent;
    const checked = li.querySelector('input').checked;

    tasks.push({text, checked});

    localStorage.setItem('tasks', JSON.stringify(tasks));
  })
}


function checkEmptyState() {
  if(taskList.children.length === 0) {
    emptyState.style.display = 'block'
  } else {
    emptyState.style.display = 'none';
  }
}

setNameBtn.addEventListener('click', () => {
  const name = prompt('What is your name?');
  if (!name) return;

  localStorage.setItem('username', name);
  greeting.textContent = `Hi, ${name} 👋`;
  setNameBtn.textContent = 'Change name';
});

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter'){
    addTaskButton.click();
  }})

addTaskButton.addEventListener('click', () => {
  const taskText = taskInput.value;
  
  if (taskText === '') return;

  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  const span = document.createElement('span');

  checkbox.type = 'checkbox';
  span.textContent = taskText;
  checkbox.addEventListener('change', () => {
    updateProgress();
    saveTasks ();
    checkEmptyState();
  });
  
  li.appendChild(checkbox);
  li.appendChild(span);

  taskList.appendChild(li);

  taskInput.value = '';
  updateProgress();
  saveTasks();
  checkEmptyState();

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';

  li.appendChild(deleteBtn);
 deleteBtn.addEventListener( 'click', () => {
    li.remove ();
    updateProgress();
    saveTasks();
    checkEmptyState();
  })
});

function updateProgress () {
  const checkboxes = document.querySelectorAll('.task-list input[type="checkbox"]');

  const total = checkboxes.length;

  let completed = 0;

  checkboxes.forEach((box) => {
    const text = box.nextElementSibling;

    if (box.checked) {
      completed++;
      text.classList.add('completed')
    } else {
      text.classList.remove('completed')
    }
  });

  summaryText.textContent = `Completed: ${completed} / ${total} tasks`;

}


document.querySelectorAll('.task-list input[type="checkbox"]')
  .forEach((box) => {
    box.addEventListener('change', updateProgress);
  });

  updateProgress();
  checkEmptyState();

  document.querySelectorAll('.task-list li button')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.parentElement.remove();
      });
    });

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (!saved) return;

  const tasks = JSON.parse(saved);

  tasks.forEach((task) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    const span = document.createElement('span');
    const deleteBtn = document.createElement('button');

    checkbox.type = 'checkbox';
    checkbox.checked = task.checked;
    span.textContent = task.text;
    deleteBtn.textContent = '🗑️';

    checkbox.addEventListener('change', () => {
      updateProgress();
      saveTasks();
      checkEmptyState();
    });

    deleteBtn.addEventListener('click', () => {
      li.remove();
      updateProgress();
      saveTasks();
      checkEmptyState();
    });

    li.append(checkbox, span, deleteBtn);
    taskList.appendChild(li);
  });

  updateProgress();
  checkEmptyState();
}

loadUser();
loadTasks();