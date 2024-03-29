import "./style.css";
import * as Project from "./project.js";
import { createAddToDoButton, createToDoTable } from "./edit_project_page.js";
import {
  closeAddProjectFormEvent,
  saveProjectFormEvent,
  openEditToDoDialog,
} from "./form_page.js";
import {getWeather} from './weather.js'
// eslint-disable-next-line prefer-const
let projects = [];

function __init__() {
  displayProjectsInSidebar(projects);
  createAProjectEvent();
  closeAddProjectFormEvent();
  saveProjectFormEvent(projects);
  displayProjectsWithToDos(projects, true);
  displayFilteredProjectsEvents(projects);
  displayAllProjectsEvent(projects);
  displayWeather();

  

  // window.addEventListener('load', () => {
  //     const stored_projects = JSON.parse(localStorage.getItem("projects"))
  //     console.log(stored_projects)
  //     if (stored_projects) {

  //         projects = stored_projects
  //         console.log(projects)
  //     }

  // })
}

function displayWeather() {
  // eslint-disable-next-line camelcase
  const current_location = document.getElementById('location')
  const confirm = document.getElementById('confirm')
  confirm.addEventListener('click',() => {
    // eslint-disable-next-line camelcase
    getWeather(current_location.value);
  })
}

function sortProjects(projects) {
  projects.sort((a, b) => {
    if (a.projectName < b.projectName) return -1;
    if (a.projectName > b.projectName) return 1;
    return 0;
  });
}

function projectsFilteredByDue(projects, due_end) {
  const filtered_projects = [];
  for (const project of projects) {
    const filtered_project = project.getToDosByDue(new Date(), due_end);
    if (filtered_project != false) {
      filtered_projects.push(filtered_project);
    }
  }
  return filtered_projects;
}

export function searchProject(project_name) {
  for (const project of projects) {
    if (project.projectName == Project.toCapitalized(project_name)) {
      return project;
    }
  }
  return false;
}

export function displayProjectsInSidebar(projects) {
  sortProjects(projects);
  const my_projects = document.querySelector(".my-projects");
  my_projects.innerHTML = "";
  for (const project of projects) {
    project.sortToDosByStatus();
    const my_project = document.createElement("button");
    my_project.classList.add("project");
    let project_completed = true;
    for (const to_do of project.projectToDo) {
      if (to_do.to_do_status != "done") {
        project_completed = false;
        break;
      }
    }
    if (project_completed == true) {
      my_project.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px"><title>tooltip-check</title><path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.11 2.9 18 4 18H8L12 22L16 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M10.46 14L6.96 10.5L8.37 9.08L10.46 11.17L15.64 6L17.05 7.41L10.46 14Z" /></svg>${project.projectName}`;
    } else {
      my_project.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px"><title>tooltip-text</title><path d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M5,5V7H19V5H5M5,9V11H15V9H5M5,13V15H17V13H5Z" /></svg>${project.projectName}`;
    }
    my_project.addEventListener("click", () => {
      displayProjectsWithToDos([project], false);
    });
    my_projects.appendChild(my_project);
  }
}

function createAProjectEvent() {
  const create_a_project = document.querySelector(".create-a-project");
  const dialog = document.querySelector(".add-a-project");
  const edit_status = dialog.querySelector("#edit-status");
  create_a_project.addEventListener("click", () => {
    edit_status.value = false;
    dialog.showModal();
  });
}

function displayFilteredProjectsEvents(projects) {
  const header = document.getElementById("header");
  const suppliment_title = document.createElement("div");
  suppliment_title.classList.add("suppliment-title");
  const due_today = document.getElementById("due_today");
  const due_this_week = document.getElementById("due_this_week");
  const due_this_month = document.getElementById("due_this_month");
  const currentDateTime = new Date();

  due_today.addEventListener("click", () => {
    const due_end = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate(),
      23,
      59,
      59,
    );
    displayProjectsWithToDos(projectsFilteredByDue(projects, due_end), false);
    suppliment_title.textContent = "(Due Today)";
    header.appendChild(suppliment_title);
  });
  due_this_week.addEventListener("click", () => {
    const due_end = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth(),
      currentDateTime.getDate() + 7,
      23,
      59,
      59,
    );
    displayProjectsWithToDos(projectsFilteredByDue(projects, due_end), false);
    suppliment_title.textContent = "(Due This Week)";
    header.appendChild(suppliment_title);
  });
  due_this_month.addEventListener("click", () => {
    const due_end = new Date(
      currentDateTime.getFullYear(),
      currentDateTime.getMonth() + 1,
      currentDateTime.getDate(),
      23,
      59,
      59,
    );
    displayProjectsWithToDos(projectsFilteredByDue(projects, due_end), false);
    suppliment_title.textContent = "(Due This Month)";
    header.appendChild(suppliment_title);
  });
}

function displayAllProjectsEvent(projects) {
  const show_all = document.querySelector(".show-all-dues");
  show_all.addEventListener("click", () => {
    displayProjectsWithToDos(projects, true);
  });
}

export function displayProjectsWithToDos(projects, isDashboard) {
  sortProjects(projects);
  const display = document.querySelector(".display");
  display.innerHTML = "";
  const suppliment_title = document.querySelector(".suppliment-title");
  if (suppliment_title != null) {
    suppliment_title.innerHTML = "";
  }
  let projectIndex = 0;
  for (const project of projects) {
    project.sortToDosByStatus();
    const card = createProjectCard(project, isDashboard, projectIndex);
    display.appendChild(card);
    projectIndex++;
  }
}

function createProjectCard(project, isDashboard, projectIndex) {
  const card = document.createElement("fieldset");
  card.classList.add("card");
  const card_legend = createCardLegend(project);
  card.appendChild(card_legend);
  const edit_button_line = createCardEditButtons(project, projects);
  card.appendChild(edit_button_line);
  const { progress_bar } = createCardProgressBar();
  card.appendChild(progress_bar);
  const { progress_bar_label } = createCardProgressBar();
  card.appendChild(progress_bar_label);
  const ul = document.createElement("ul");
  ul.classList.add("project_to_dos");
  let taskIndex = 0;
  let done_task = 0;
  for (const project_task of project.projectToDo) {
    if (project_task.to_do_status == "done") {
      done_task++;
    }
    const li = createToDoListItem(
      project_task,
      isDashboard,
      projectIndex,
      taskIndex,
    );
    ul.appendChild(li);
    taskIndex++;
  }
  const total_task = project.projectToDo.length;
  updateProgressBar(progress_bar, progress_bar_label, done_task, total_task);
  card.appendChild(ul);
  return card;
}

function createCardLegend(project) {
  const project_name = document.createElement("legend");
  project_name.classList.add("project_name");
  project_name.value = project.projectName;
  project_name.textContent = project.projectName;
  return project_name;
}
function createCardEditButtons(project, projects) {
  // Edit a project buttons: add button and delete button
  const edit_button_line = document.createElement("div");
  edit_button_line.classList.add("edit_project_buttons");
  const add_button = createAddButton(project);
  edit_button_line.appendChild(add_button);
  const delete_button = createProjectDeleteButton(project, projects);
  edit_button_line.appendChild(delete_button);
  return edit_button_line;
}
function createCardProgressBar() {
  const progress_bar = document.createElement("progress");
  progress_bar.classList.add("progress_bar");
  const progress_bar_label = document.createElement("span");
  progress_bar_label.classList.add("progress_bar_label");
  return { progress_bar, progress_bar_label };
}
function updateProgressBar(
  progress_bar,
  progress_bar_label,
  done_task,
  total_task,
) {
  const percentage = done_task / total_task;
  progress_bar.value = percentage;
  progress_bar_label.textContent = `${(percentage * 100).toFixed(0)}%`;
  return percentage;
}

function createAddButton(project) {
  // Add a new to do task button
  const add_button = document.createElement("button");
  add_button.classList.add("add_new_to_do");
  add_button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>';
  add_button.addEventListener("click", () => {
    const to_do_index = 0;
    const display = document.querySelector(".display");
    display.innerHTML = "";
    const card = document.createElement("fieldset");
    card.classList.add("card");
    display.appendChild(card);
    const project_name = document.createElement("legend");
    project_name.classList.add("project_name");
    project_name.value = project.projectName;
    project_name.textContent = project.projectName;
    card.appendChild(project_name);
    const add_to_do_button = createAddToDoButton(project, to_do_index);
    card.appendChild(add_to_do_button);
    // Create a table to display existing to dos and add new to dos
    const table = createToDoTable(project);
    card.appendChild(table);
  });
  return add_button;
}

function createProjectDeleteButton(project, projects) {
  // Delete the project button
  const delete_button = document.createElement("button");
  delete_button.classList.add("delete_project");
  delete_button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
  delete_button.addEventListener("click", () => {
    const result = confirm(
      "Do you want to delete this project? Please note that you will lose all to do tasks under this project once you delete it.",
    );
    if (result == true) {
      const delete_index = projects.findIndex(
        (current_project) => current_project.projectName == project.projectName,
      );
      if (delete_index != -1) {
        projects.splice(delete_index, 1);
      }
      displayProjectsWithToDos(projects, true);
      displayProjectsInSidebar(projects);
    }
  });
  return delete_button;
}

function createToDoListItem(
  project_task,
  isDashboard,
  projectIndex,
  taskIndex,
) {
  const li = document.createElement("li");
  const to_do_description = createToDoDescription(
    project_task,
    projectIndex,
    taskIndex,
  );
  const label = createToDoLabel(
    project_task,
    isDashboard,
    projectIndex,
    taskIndex,
  );
  const edit = createEditButton(project_task, to_do_description);
  const delete_button = createDeleteButton(to_do_description);

  li.appendChild(to_do_description);
  li.appendChild(label);
  li.appendChild(edit);
  li.appendChild(delete_button);

  return li;
}

function createToDoDescription(project_task, projectIndex, taskIndex) {
  const to_do_description = document.createElement("input");
  to_do_description.type = "checkbox";
  to_do_description.id = `description${projectIndex}-${taskIndex}`;
  to_do_description.name = "description";
  to_do_description.value = project_task.description;
  if (project_task.to_do_status == "done") {
    to_do_description.checked = true;
  }
  to_do_description.addEventListener("click", () => {
    updateToDoStatus(project_task, to_do_description);
    displayProjectsInSidebar(projects);
    displayProjectsWithToDos(projects, true);
  });
  return to_do_description;
}

function updateToDoStatus(project_task, to_do_description) {
  const project_name =
    to_do_description.parentElement.parentElement.parentElement.firstChild
      .value;
  const project_to_be_changed = searchProject(project_name);
  if (project_to_be_changed != false) {
    const index = project_to_be_changed.projectToDo.findIndex(
      (task) => task.description == project_task.description,
    );
    if (index !== -1) {
      project_to_be_changed.projectToDo[index].to_do_status =
        to_do_description.checked ? "done" : "to_do";
      updateToDoStatusLabel(to_do_description, project_task);
    }
  }
}

function updateToDoStatusLabel(to_do_description) {
  const label = to_do_description.parentElement.querySelector("label");
  if (label) {
    const statusDiv = label.querySelector(".status");
    if (statusDiv) {
      statusDiv.textContent = `Status: ${to_do_description.checked ? "Done" : "To Do"}`;
    }
  }
}

function createToDoLabel(project_task, isDashboard, projectIndex, taskIndex) {
  const label = document.createElement("label");
  label.htmlFor = `description${projectIndex}-${taskIndex}`;

  if (isDashboard == true) {
    label.textContent = project_task.description;
  } else {
    const due_date_time = formatDueDateTime(project_task.due_date_time);
    const priority =
      project_task.priority[0].toUpperCase() +
      project_task.priority.substring(1);
    let priority_color = "";
    const priority_font = "font-family: cursive, Chalkduster, fantasy";
    const priority_weight = "bold";
    if (priority == "High") {
      priority_color = "red";
    } else if (priority == "Normal") {
      priority_color = "blue";
    } else if (priority == "Low") {
      priority_color = "green";
    }
    let to_do_status;
    if (project_task.to_do_status == "to_do") {
      to_do_status = "To Do";
    } else if (project_task.to_do_status == "doing") {
      to_do_status = "Doing";
    } else if (project_task.to_do_status == "done") {
      to_do_status = "Done";
    }
    label.innerHTML =
      `${project_task.description}<div>` +
      `Due On: ${due_date_time}</div>` +
      "<div>" +
      "Priority: " +
      `<span style="color: ${priority_color}; ${priority_font};font-weight: ${priority_weight}" >${priority}</span>` +
      "</div>" +
      '<div class="status">' +
      `Status: ${to_do_status}</div>`;
  }
  return label;
}

function createEditButton(project_task, to_do_description) {
  const edit = document.createElement("button");
  edit.classList.add("editBtn");
  edit.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
  edit.addEventListener("click", () => {
    openEditToDoDialog(project_task, to_do_description);
  });
  return edit;
}
function createDeleteButton(to_do_description) {
  const delete_button = document.createElement("button");
  delete_button.classList.add("deleteBtn");
  delete_button.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>';
  delete_button.addEventListener("click", () => {
    const result = confirm("Do you want to delete this task?");
    if (result == true) {
      const target_project_name =
        to_do_description.parentElement.parentElement.parentElement.firstChild
          .value;
      const target_project = searchProject(target_project_name);
      target_project.deleteToDo(to_do_description.value);
      displayProjectsWithToDos(projects, true);
    }
  });
  return delete_button;
}

export function formatDueDateTime(dateTime) {
  if (dateTime.getTime() == new Date(8640000000000000).getTime()) {
    return "Never Due";
  }
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();
  const year = dateTime.getFullYear();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");
  return `${month}/${day}/${year} ${hours}:${minutes}`;
}

projects.push(Project.work);
projects.push(Project.homeRenovation);
projects.push(Project.fitnessGoals);
projects.push(Project.studyPlan);
projects.push(Project.vacationPlanning);
projects.push(Project.sideProject);
projects.push(Project.newProjectB);
projects.push(Project.newProjectC);

__init__();

// test

// const todo1 = new ToDo('descriptiona', new Date(2024,2,18,12,0,0));
// const newProjectA = new Project('   project     A  ', todo1)
// projects.push(newProjectA)
// todo1.priority = 'low'
// todo1.to_do_status = 'doing'
// const todo2 = new ToDo('descriptionb', new Date(2024,2,21,5,0,0),'high','done');
// newProjectA.projectToDo = [todo1,todo2]
// const newProjectD = new Project('project D  ', [new ToDo('description', new Date(2024,2,16,3,0,0),'high','done')])
// projects.push(newProjectD)
// const newProjectE = new Project('project E', [new ToDo('description')])
// projects.push(newProjectE)

// function storageAvailable(type) {
//     let storage;
//     try {
//       storage = window[type];
//       const x = "__storage_test__";
//       storage.setItem(x, x);
//       storage.removeItem(x);
//       return true;
//     } catch (e) {
//       return (
//         e instanceof DOMException &&
//         // everything except Firefox
//         (e.code === 22 ||
//           // Firefox
//           e.code === 1014 ||
//           // test name field too, because code might not be present
//           // everything except Firefox
//           e.name === "QuotaExceededError" ||
//           // Firefox
//           e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
//         // acknowledge QuotaExceededError only if there's something already stored
//         storage &&
//         storage.length !== 0
//       );
//     }
// }
// if (storageAvailable("localStorage")) {
//     console.log('Yippee! We can use localStorage awesomeness')
// } else {
//     console.log('Too bad, no localStorage for us')
// }
