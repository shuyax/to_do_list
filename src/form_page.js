import {
  searchProject,
  displayProjectsWithToDos,
  displayProjectsInSidebar,
} from "./index.js";
import * as Project from "./project.js";

export function closeAddProjectFormEvent() {
  const dialog = document.querySelector(".add-a-project");
  const close_project_form = dialog.querySelector(".close");
  close_project_form.addEventListener("click", () => {
    dialog.close();
    resetForm("add-project-form");
  });
}

export function saveProjectFormEvent(projects) {
  const dialog = document.querySelector(".add-a-project");
  const save_project_form = dialog.querySelector(".save");
  save_project_form.addEventListener("click", () => {
    const edit_status = dialog.querySelector("#edit-status");
    if (edit_status.value == false) {
      // Create a new project
      if (createProjectFromValidForm(projects) != false) {
        displayProjectsWithToDos(projects, true);
        displayProjectsInSidebar(projects);
        dialog.close();
        resetForm("add-project-form");
      }
    } else {
      // Edit an existing project
      const project = searchProject(dialog.dataset.projectName);
      const project_to_do = project.searchToDo(
        dialog.dataset.projectDescription,
      );
      if (editProjectFromValidForm(project, project_to_do) != false) {
        displayProjectsWithToDos(projects, true);
        displayProjectsInSidebar(projects);
        dialog.close();
        resetForm("add-project-form");
      }
    }
  });
}

function createProjectFromValidForm(projects) {
  const description = document.getElementById("to-do-description");
  const due = document.getElementById("to-do-due");
  const priority = document.querySelector('input[name="priority"]:checked');
  const status = document.querySelector('input[name="status"]:checked');
  const project_name = document.getElementById("project-name");
  if (projectCreationFormValidation() == true) {
    if (description.value != "") {
      const newProject = new Project.Project(project_name.value);
      if (priority == null) {
        if (status == null) {
          newProject.addNewToDo(description.value, due.value);
        } else {
          newProject.addNewToDo(
            description.value,
            due.value,
            null,
            status.value,
          );
        }
      } else if (status == null) {
        newProject.addNewToDo(description.value, due.value, priority.value);
      } else {
        newProject.addNewToDo(
          description.value,
          due.value,
          priority.value,
          status.value,
        );
      }
      projects.push(newProject);
      // localStorage.setItem("projects", JSON.stringify(projects));
      return true;
    }
    const newProject = new Project.Project(project_name.value);
    projects.push(newProject);
    // localStorage.setItem("projects", JSON.stringify(projects));
    return true;
  }
  return false;
}

function projectCreationFormValidation() {
  const project_name = document.getElementById("project-name");
  if (project_name.value.trim() != "") {
    if (searchProject(project_name.value) == false) {
      return true;
    }
    alert(
      `This project: ${project_name.value} already exists. Please use a new project name!`,
    );
  } else {
    alert("Please enter valid project name!");
  }
  return false;
}

function projectEditFormValidation() {
  const name = document.getElementById("project-name");
  const description = document.getElementById("to-do-description");
  if (name.value.trim() != "" && description.value.trim() != "") {
    return true;
  }
  alert("Please enter valid updated information!");

  return false;
}

function editProjectFromValidForm(project, project_to_do) {
  const name = document.getElementById("project-name");
  const description = document.getElementById("to-do-description");
  const due = document.getElementById("to-do-due");
  const priority = document.querySelector('input[name="priority"]:checked');
  const status = document.querySelector('input[name="status"]:checked');
  if (projectEditFormValidation() == true) {
    if (name.value != "") {
      project.projectName = name.value;
    }
    if (description.value != "") {
      project_to_do.description = description.value;
    }
    if (due.value != "") {
      project_to_do.due_date_time = Project.validDateTimeFormat(due.value);
    }
    if (priority.value != "") {
      project_to_do.priority = priority.value;
    }
    if (status.value != "") {
      project_to_do.to_do_status = status.value;
    }
    return true;
  }
  return false;
}

function resetForm(form_id) {
  const form = document.getElementById(form_id);
  form.reset();
}

export function openEditToDoDialog(project_task, to_do_description) {
  const dialog = document.querySelector(".add-a-project");
  dialog.showModal();
  const target_project_name =
    to_do_description.parentElement.parentElement.parentElement.firstChild
      .value;
  const project_name = dialog.querySelector("#project-name");
  const description = dialog.querySelector("#to-do-description");
  const due = dialog.querySelector("#to-do-due");
  const priority_buttons = dialog.querySelectorAll('input[name="priority"]');
  const status_buttons = dialog.querySelectorAll('input[name="status"]');
  const edit_status = dialog.querySelector("#edit-status");
  edit_status.value = true;
  project_name.value = target_project_name;
  description.value = project_task.description;
  due.value = `${project_task.due_date_time.getFullYear()}-${String(project_task.due_date_time.getMonth() + 1).padStart(2, "0")}-${String(project_task.due_date_time.getDate()).padStart(2, "0")}T${String(project_task.due_date_time.getHours()).padStart(2, "0")}:${String(project_task.due_date_time.getMinutes()).padStart(2, "0")}`;
  priority_buttons.forEach((priority_button) => {
    if (priority_button.value == project_task.priority) {
      priority_button.checked = true;
    }
  });
  status_buttons.forEach((status_button) => {
    if (status_button.value == project_task.to_do_status) {
      status_button.checked = true;
    }
  });
  dialog.dataset.projectName = project_name.value;
  dialog.dataset.projectDescription = description.value;
}