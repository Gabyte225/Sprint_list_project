const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addTaskContainers = document.querySelectorAll(".add-container");
const addTask = document.querySelectorAll("#add-task");

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
  listEl.id = index;
  listEl.classList.add("drag-item");
  columnEl.appendChild(listEl);
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
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

  updatedOnLoad = true;
  updateSavedColumns();
}

function addToColumn(column) {
  const itemText = addTask[column].value;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addTask[column].textContent = "";
  updateDOM(column);
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addTaskContainers[column].style.display = "flex";
}

function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addTaskContainers[column].style.display = "none";
  addToColumn(column);
}

updateDOM();
