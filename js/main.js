const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");


let tasks = [];


if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  tasks.forEach((task) => {
    renderTasks(task);
  });
}

checkEmptyList();

form.addEventListener("submit", addTask);

taskList.addEventListener("click", deleteTask);

taskList.addEventListener("click", doneTask);

function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(), 
    text: taskText, 
    done: false, 
  };

  renderTasks(newTask);

  tasks.push(newTask);

  saveToLocalStorage();

  taskInput.value = "";
  taskInput.focus();
  checkEmptyList();
}

function deleteTask(e) {
  if (e.target.dataset.action !== "delete") return;

  const parentNode = e.target.closest(".task-item");

  const id = Number(parentNode.id);

  tasks = tasks.filter((task) => task.id !== id);

  saveToLocalStorage();

  parentNode.remove();

  checkEmptyList();
}

function doneTask(e) {
  if (e.target.dataset.action !== "done") return;

  const parentNode = e.target.closest(".task-item");

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  console.log(tasks.length);
  if (tasks.length === 0) {
    const emptyListElement = `
                          <li id="emptyList" class="list-group-item empty-list ">
                            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                            <div class="empty-list__title">Список дел пуст</div>
                          </li>
                              `;
    taskList.insertAdjacentHTML("afterbegin", emptyListElement);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(objTask) {
  const cssClass = objTask.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `
                    <li class="list-group-item d-flex justify-content-between task-item" id='${objTask.id}' >
                      <span class="${cssClass}">${objTask.text}</span>
                      <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                          <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                          <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                      </div>
                    </li>
                  `;

  taskList.insertAdjacentHTML("beforeend", taskHtml);
}
