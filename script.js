const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addTaskContainers = document.querySelectorAll(".add-container");
const addTask = document.querySelectorAll("#add-task");
const addTaskButton = document.querySelectorAll(".add-task-button");

const listColumns = document.querySelectorAll(".drag-item-list");
const todoListEl = document.querySelector("#todo-list");
const progressListEl = document.querySelector("#progress-list");
const completeListEl = document.querySelector("#complete-list");
const notSureListEl = document.querySelector("#not-sure-list");

let updatedOnLoad = false;

let todoListArray = [];
let progressListArray = [];
let completeListArray = [];
let notSureListArray = [];
let listArrays = [];

let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
  if (localStorage.getItem("todoItems")) {
    todoListArray = JSON.parse(localStorage.todoItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    notSureListArray = JSON.parse(localStorage.notSureItems);
  }
}

function updateSavedColumns() {
  listArrays = [
    todoListArray,
    progressListArray,
    completeListArray,
    notSureListArray,
  ];
  const arrayNames = ["todo", "progress", "complete", "notSure"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.id = index;
  listEl.classList.add("drag-item");
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
    updatedOnLoad = true;
  }

  todoListEl.textContent = "";
  todoListArray.forEach((todoItem, index) => {
    createItemEl(todoListEl, 0, todoItem, index);
  });
  todoListArray = filterArray(todoListArray);

  progressListEl.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  completeListEl.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  notSureListEl.textContent = "";
  notSureListArray.forEach((notSureItem, index) => {
    createItemEl(notSureListEl, 3, notSureItem, index);
  });
  notSureListArray = filterArray(notSureListArray);

  updateSavedColumns();
}

function addToColumn(column) {
  const itemText = addTask[column].value;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addTask[column].value = "";
  updateDOM(column);
}
addTaskButton.forEach((button, i) =>
  button.addEventListener("click", (e) => {
    e.target.classList.remove("add-task-button");
    e.target.classList.add("add-button-active");
    saveItemBtns[i].classList.remove("solid");
    saveItemBtns[i].classList.add("saveItemBtns-active");
    addTaskContainers[i].classList.remove("add-container");
    addTaskContainers[i].classList.add("addTaskContainers-active");
  })
);

saveItemBtns.forEach((button, i) =>
  button.addEventListener("click", (e) => {
    addTaskButton[i].classList.remove("add-button-active");
    addTaskButton[i].classList.add("add-task-button");
    e.target.classList.remove("saveItemBtns-active");
    e.target.classList.add("solid");
    addTaskContainers[i].classList.remove("addTaskContainers-active");
    addTaskContainers[i].classList.add("add-container");
    addToColumn([i]);
  })
);

function rebuildArrays() {
  todoListArray = [];
  for (let i = 0; i < todoListEl.children.length; i++) {
    todoListArray.push(todoListEl.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressListEl.children.length; i++) {
    progressListArray.push(progressListEl.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeListEl.children.length; i++) {
    completeListArray.push(completeListEl.children[i].textContent);
  }
  notSureListArray = [];
  for (let i = 0; i < notSureListEl.children.length; i++) {
    notSureListArray.push(notSureListEl.children[i].textContent);
  }
  updateDOM();
}

function dragEnter(column) {
    listColumns[column].classList.add('over');
    currentColumn = column;
  }

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();
