//drag'n'drop buttons:
const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addTaskContainers = document.querySelectorAll(".add-container");
const addTask = document.querySelectorAll(".add-task");
const addTaskButton = document.querySelectorAll(".add-task-button");
//drag'n'drop inputs:
const listColumns = document.querySelectorAll(".drag-item-list");
const todoListEl = document.querySelector("#todo-list");
const progressListEl = document.querySelector("#progress-list");
const completeListEl = document.querySelector("#complete-list");
const notSureListEl = document.querySelector("#not-sure-list");
//countdown form:
const countdownForm = document.getElementById("countdown-form");
const inputContainer = document.getElementById("input-container");
const dateEl = document.getElementById("date-picker");
//countdown clock:
const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll(".span-list");
//countdown complete:
const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

//Drag'n'drop logic:
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
  listEl.setAttribute("ondragstart", "drag(event)");
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
  if (addTask[column].value != "") {
    addTask[column].value = "";
    selectedArray.push(itemText);
  }

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

listColumns.forEach((drag, i) =>
  drag.addEventListener("dragenter", (e) => {
    currentColumn = e.target.column;
    listColumns[i].classList.add("over");
  })
);

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

listColumns.forEach((ondragover) =>
  ondragover.addEventListener("dragover", (e) => {
    e.preventDefault();
  })
);

listColumns.forEach((drop, i) =>
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    const parent = listColumns[i];
    listColumns.forEach((column) => {
      column.classList.remove("over");
    });
    parent.appendChild(draggedItem);
    dragging = false;
    rebuildArrays();
  })
);

updateDOM();

//Countdown logic:
let countdownTitle = "";
let countdownDate = "";
let countdownValue = Date;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

function updateDOC() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
    inputContainer.hidden = true;
    if (distance < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
      todoListArray = [];
      progressListArray = [];
      completeListArray = [];
      notSureListArray = [];
      updateDOM();
    } else {
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

function updateCountdown(e) {
  e.preventDefault();
  countdownDate = e.srcElement[0].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));
  if (countdownDate === "") {
    alert("Please select a date for sprint countdown.");
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOC();
  }
}

function reset() {
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  clearInterval(countdownActive);
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

function setCountdown() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOC();
  }
}

countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

setCountdown();
