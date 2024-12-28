"use strict";

// Get DOM elements
const errorBox = document.getElementById("error-div");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("btn-add-task");
const statusDropdown = document.getElementById("status-dropdown");
const searchInput = document.getElementById("search-input");
const todoTable = document.getElementById("table-todo");
const taskList = document.getElementById("task-list");
const sortBtns = document.getElementsByClassName("sort");
const quoteText = document.getElementById("quote-text");
const quoteBtn = document.getElementById("quote-button");
const toggleSwitch = document.getElementById("mode");

// Initialize an empty array to hold the tasks
let tasks;

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve tasks from local storage
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render the tasks
  renderTasks();
});

/**
 * Renders the list of tasks in the task table.
 * @param {Array} tasksToRender - The array of tasks to render. Defaults to the global tasks array.
 * Clears the current task list and generates rows for each task,
 * displaying the task name and a button to mark it complete if not already done.
 */
function renderTasks(tasksToRender = tasks) {
  // Clear the current task list
  taskList.innerHTML = "";

  // Initialize an empty string to hold the task HTML
  let taskHTML = "";

  // Iterate over each task in the tasksToRender array
  tasksToRender.forEach(task => {
    // Append a table row for each task
    taskHTML += `
      <tr>
        <td>${task.date}</td>
        <td>${task.name}</td>
        <td>
          ${
            // Check the status of the task
            task.status === 0
              ? // If incomplete, show a button to mark it complete
                `<button class='btn-complete' data-id=${task.id}>Mark complete</button>`
              : // If complete, display "Done"
                "Done"
          }
        </td>
      </tr>
    `;
  });

  // Update the task list with the generated HTML
  taskList.innerHTML = taskHTML;

  // Call the makeStatusList function to update the status dropdown
  makeStatusList();
}

/**
 * Shows an error message in the #error-div element
 * for 2 seconds when called.
 */
function showError(errMessage) {
  // Set the error message text
  errorBox.innerText = errMessage;

  // Show the error message
  errorBox.style.display = "block";

  // Set a timeout to hide the error after 2 seconds
  setTimeout(() => {
    // Hide the error message
    errorBox.style.display = "none";
    // Focus the task input field
    taskInput.focus();
  }, 2000);
}

/**
 * Clears the input field and removes any error messages.
 * Also focuses the input field.
 */
function clearInput() {
  // Clear the error message text
  errorBox.innerText = "";
  // Clear the input field value
  taskInput.value = "";
  // Focus the input field
  taskInput.focus();
}

/**
 * Creates the list of unique task statuses in the #status-dropdown select element
 */
function makeStatusList() {
  // Get the unique task statuses
  const taskStatuses = tasks.map(task => task.status);
  const uniqueTaskStatuses = [...new Set(taskStatuses)];

  // Generate HTML for each status option
  const statusOptions = uniqueTaskStatuses.map(status => {
    return `<option value=${status}>${getStatusText(status)}</option>`;
  });

  // Update the #status-dropdown select element
  // with the generated HTML
  statusDropdown.innerHTML = `<option value="" disabled selected>Select Status</option>${statusOptions.join(
    ""
  )}`;
}

/**
 * Returns the text to be displayed for a given task status
 * @param {number} status 0 for incomplete, 1 for complete
 */
function getStatusText(status) {
  return status === 0 ? "Incomplete" : "Complete";
}

// Add a click event listener to the "Add Task" button
addTaskBtn.addEventListener("click", e => {
  // Prevent the form from submitting
  e.preventDefault();

  // Get the value of the task input field
  const taskText = taskInput.value.trim();

  // Check if the task text is empty
  if (taskText === "") {
    showError("Task cannot be empty!");
    return;
  }

  // Create a new task object
  const task = {
    id: Date.now(),
    name: taskText,
    date: new Date().toLocaleString(),
    status: 0, // currently incomplete
  };

  // Add the task to the tasks array
  tasks.push(task);

  // Save the tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Render the tasks
  renderTasks();

  // Clear the input field
  clearInput();
});

// Add a click event listener to the task table
todoTable.addEventListener("click", e => {
  // guard clause
  if (!e.target.classList.contains("btn-complete")) return;

  // The target is a button to mark a task complete
  // get the task id
  const taskId = parseInt(e.target.dataset.id);

  // find the task
  const task = tasks.find(t => t.id === taskId);

  // toggle the status property
  task.status = 1;

  // Save the tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // render the tasks again
  renderTasks();
});

// Add a change event listener to the #status-dropdown select element
statusDropdown.addEventListener("change", e => {
  // get the selected value
  const status = parseInt(e.target.value);

  // filter the tasks based on the selected status
  const filteredTasks = tasks.filter(t => t.status === status);

  // render the tasks again
  renderTasks(filteredTasks);
});

// Add a keyup event listener to the #search-input input field
searchInput.addEventListener("keyup", e => {
  // get the search text
  const searchText = e.target.value.toLowerCase();

  // filter the tasks based on the search text
  const filteredTasks = tasks.filter(t =>
    t.name.toLowerCase().includes(searchText)
  );

  // render the tasks again
  renderTasks(filteredTasks);
});

// boolean variable to keep track of sorting order
// state data, we keep it as global;
let isAscending = true;

// Add a click event listener to each header cell
Array.from(sortBtns).forEach(btn => {
  btn.addEventListener("click", e => {
    const sortType = e.target.dataset.sort;

    // Now sort date-wise
    if (sortType === "date") {
      isAscending
        ? tasks.sort((a, b) => a.id - b.id)
        : tasks.sort((a, b) => b.id - a.id);
    }

    // Now sort task-wise
    if (sortType === "task") {
      isAscending
        ? tasks.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          )
        : tasks.sort((a, b) =>
            b.name.toLowerCase().localeCompare(a.name.toLowerCase())
          );
    }

    // Now sort status-wise
    if (sortType === "status") {
      isAscending
        ? tasks.sort((a, b) => a.status - b.status)
        : tasks.sort((a, b) => b.status - a.status);
    }
    isAscending = !isAscending;
    renderTasks();
  });
});

async function getData() {
  const url = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
  try {
    const response = await fetch(url);
    // Guard clause
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const quoteString = await response.json();
    quoteText.innerHTML = quoteString;
  } catch (error) {
    showError(error.message);
  }
}

// Call getData() as the page loads
getData();

// Add event-listener for quoteBtn
quoteBtn.addEventListener("click", getData);

// Add event listener for switchElm
toggleSwitch.addEventListener("change", () => {
  document.querySelector(".container").classList.toggle("dark-mode");
  quoteText.style.color = "#fdcb6e";
});
