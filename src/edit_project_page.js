import { searchProject, formatDueDateTime } from "./index.js";
import * as Project from "./project.js";

export function createAddToDoButton(project, to_do_index) {
  const add_to_do_button = document.createElement("button");
  add_to_do_button.classList.add("add_to_do_button");
  add_to_do_button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>';
  add_to_do_button.addEventListener("click", () => {
    createNewTableRowEvent(project, to_do_index);
    to_do_index++;
  });
  return add_to_do_button;
}

function createNewTableRowEvent(project, to_do_index) {
  const table_body = document.querySelector(".table_body");
  const table_row = document.createElement("tr");
  table_body.appendChild(table_row);
  // Add input field under description
  createDescriptionField(table_row, to_do_index);
  // Add input field under due
  createDueField(table_row, to_do_index);
  // Add dropdown menu under priority
  createPriorityDropdown(table_row, to_do_index);
  // Add dropdown menu under status
  createStatusDropdown(table_row, to_do_index);
  // Add a Save button to create a new to do task
  createSaveButton(table_body, project, to_do_index);
}

function createDescriptionField(table_row, to_do_index) {
  const to_do_description = document.createElement("th");
  to_do_description.scope = "row";
  to_do_description.innerHTML = `<ul><li id=${to_do_index}></li></ul>`;
  table_row.appendChild(to_do_description);
  const to_do_description_label = document.createElement("label");
  to_do_description_label.htmlFor = `description${to_do_index}`;
  const to_do_description_input = document.createElement("input");
  to_do_description_input.type = "text";
  to_do_description_input.id = `description${to_do_index}`;
  const li = document.getElementById(to_do_index);
  li.appendChild(to_do_description_label);
  li.appendChild(to_do_description_input);
}

function createDueField(table_row, to_do_index) {
  const to_do_due = document.createElement("td");
  to_do_due.classList.add(`to_do_due${to_do_index}`);
  table_row.appendChild(to_do_due);
  const to_do_due_label = document.createElement("label");
  to_do_due_label.htmlFor = `due${to_do_index}`;
  const to_do_due_input = document.createElement("input");
  to_do_due_input.type = "datetime-local";
  to_do_due_input.id = `due${to_do_index}`;
  to_do_due.appendChild(to_do_due_label);
  to_do_due.appendChild(to_do_due_input);
}

function createPriorityDropdown(table_row, to_do_index) {
  const to_do_priority = document.createElement("td");
  to_do_priority.classList.add(`to_do_priority${to_do_index}`);
  table_row.appendChild(to_do_priority);
  const priority_select = document.createElement("select");
  priority_select.name = "priority";
  to_do_priority.appendChild(priority_select);
  const priority_option_high = document.createElement("option");
  priority_option_high.value = "high";
  priority_option_high.textContent = "High Priority";
  priority_select.appendChild(priority_option_high);
  const priority_option_normal = document.createElement("option");
  priority_option_normal.value = "normal";
  priority_option_normal.textContent = "Normal Priority";
  priority_select.appendChild(priority_option_normal);
  const priority_option_low = document.createElement("option");
  priority_option_low.value = "low";
  priority_option_low.textContent = "Low Priority";
  priority_option_low.selected = true;
  priority_select.appendChild(priority_option_low);
}
function createStatusDropdown(table_row, to_do_index) {
  const to_do_status = document.createElement("td");
  to_do_status.classList.add(`to_do_status${to_do_index}`);
  table_row.appendChild(to_do_status);
  const status_select = document.createElement("select");
  status_select.name = "status";
  to_do_status.appendChild(status_select);
  const status_option_to_do = document.createElement("option");
  status_option_to_do.value = "to_do";
  status_option_to_do.textContent = "To Do";
  status_select.appendChild(status_option_to_do);
  const status_option_doing = document.createElement("option");
  status_option_doing.value = "doing";
  status_option_doing.textContent = "Doing";
  status_select.appendChild(status_option_doing);
  const status_option_done = document.createElement("option");
  status_option_done.value = "done";
  status_option_done.textContent = "Done";
  status_select.appendChild(status_option_done);
}
function createSaveButton(table_body, project, to_do_index) {
  const row = document.createElement("tr");
  row.classList.add("save_button_row");
  table_body.appendChild(row);
  const save = document.createElement("th");
  save.colSpan = 4;
  save.classList.add("save-button-cell");
  row.appendChild(save);
  const save_button = document.createElement("button");
  save_button.classList.add("save_button");
  save_button.textContent = "Save";
  save.appendChild(save_button);
  save_button.addEventListener("click", () => {
    if (addNewToDoToProject(project, to_do_index) == true) {
      save_button.remove();
      row.innerHTML = "";
    }
  });
}

function addNewToDoToProject(project, to_do_index) {
  const current_project = searchProject(project.projectName);
  const user_description = document.getElementById(
    `description${to_do_index}`,
  ).value;
  const due = document.getElementById(`due${to_do_index}`);
  const priority = document.querySelector('select[name="priority"]');
  const status = document.querySelector('select[name="status"]');
  const user_due = due.value;
  const user_priority = priority.value;
  const user_status = status.value;
  if (user_description == "") {
    alert("Please enter valid to do description!");
    return false;
  }
  if (current_project.searchToDo(user_description) == false) {
    current_project.addNewToDo(
      user_description,
      user_due,
      user_priority,
      user_status,
    );
    updateUIToDoTask(
      to_do_index,
      user_description,
      user_due,
      user_priority,
      user_status,
    );
    return true;
  }
  alert("This to do task already exists!");
  return false;
}

function updateUIToDoTask(
  to_do_index,
  user_description,
  user_due,
  user_priority,
  user_status,
) {
  const table_body = document.querySelector(".table_body");
  const li = document.getElementById(to_do_index);
  li.innerHTML = user_description;
  const to_do_due = table_body.querySelector(`.to_do_due${to_do_index}`);
  if (user_due == "") {
    to_do_due.textContent = "Never Due";
  } else {
    to_do_due.textContent = formatDueDateTime(
      Project.validDateTimeFormat(user_due),
    );
  }
  const to_do_priority = table_body.querySelector(
    `.to_do_priority${to_do_index}`,
  );
  to_do_priority.innerHTML =
    user_priority[0].toUpperCase() + user_priority.substring(1);
  const to_do_status = table_body.querySelector(`.to_do_status${to_do_index}`);
  if (user_status == "to_do") {
    user_status = "To Do";
  } else if (user_status == "doing") {
    user_status = "Doing";
  } else if (user_status == "done") {
    user_status = "Done";
  }
  to_do_status.innerHTML = user_status;
}

export function createToDoTable(project) {
  // Create a table to display existing to dos and add new to dos
  const table = document.createElement("div");
  table.classList.add("table");
  // Create table's head
  const table_head = createTableHead();
  table.appendChild(table_head);
  // Create table's body
  const table_body = createTableBody(project);
  table.appendChild(table_body);
  return table;
}

function createTableHead() {
  // Create table's head
  const table_head = document.createElement("thead");
  const head_row = document.createElement("tr");
  table_head.appendChild(head_row);
  const header_description = document.createElement("th");
  header_description.scope = "col";
  header_description.textContent = "To Do Task Description";
  head_row.appendChild(header_description);
  const header_due = document.createElement("th");
  header_due.scope = "col";
  header_due.textContent = "Due On";
  head_row.appendChild(header_due);
  const header_priority = document.createElement("th");
  header_priority.scope = "col";
  header_priority.textContent = "Priority";
  head_row.appendChild(header_priority);
  const header_status = document.createElement("th");
  header_status.scope = "col";
  header_status.textContent = "Status";
  head_row.appendChild(header_status);
  return table_head;
}
function createTableBody(project) {
  // Create table's body
  const table_body = document.createElement("tbody");
  table_body.classList.add("table_body");
  fillTableCell(project, table_body);
  return table_body;
}
function fillTableCell(project, table_body) {
  // Fill out table with projects' data
  const current_project_to_dos = searchProject(project.projectName).projectToDo;
  for (const todo of current_project_to_dos) {
    const table_row = document.createElement("tr");
    table_body.appendChild(table_row);
    const to_do_description = document.createElement("th");
    to_do_description.scope = "row";
    to_do_description.innerHTML = `<ul><li>${todo.description}</li></ul>`;
    table_row.appendChild(to_do_description);
    const to_do_due = document.createElement("td");
    to_do_due.textContent = formatDueDateTime(todo.due_date_time);
    table_row.appendChild(to_do_due);
    const to_do_priority = document.createElement("td");
    to_do_priority.textContent =
      todo.priority[0].toUpperCase() + todo.priority.substring(1);
    table_row.appendChild(to_do_priority);
    const to_do_status = document.createElement("td");
    let to_do_status_text;
    if (todo.to_do_status == "to_do") {
      to_do_status_text = "To Do";
    } else if (todo.to_do_status == "doing") {
      to_do_status_text = "Doing";
    } else if (todo.to_do_status == "done") {
      to_do_status_text = "Done";
    }
    to_do_status.textContent = to_do_status_text;
    table_row.appendChild(to_do_status);
  }
}
