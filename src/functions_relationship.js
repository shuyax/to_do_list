const acorn = require('acorn');

// JavaScript code to parse
const code = `
function sortProjects(projects){
    projects.sort((a,b) => {
        if (a.projectName < b.projectName) return -1;
        if (a.projectName > b.projectName) return 1;
        return 0;
    })
}



function projectsFilteredByDue(projects, due_end){
    let filtered_projects = []
    for (let project of projects) {
        const filtered_project = project.getToDosByDue(new Date(),due_end)
        if (filtered_project != false){
            filtered_projects.push(filtered_project)
        }
    }
    return filtered_projects
}



function searchProject(project_name){
    for (let project of projects){
        if (project.projectName == Project.toCapitalized(project_name)){
            return project
        }
    }
    return false
}


function resetForm(form_id){
    const form = document.getElementById(form_id);
    form.reset()
}

function closeAddProjectFormEvent(){
    const dialog = document.querySelector(".add-a-project");
    const close_project_form = dialog.querySelector('.close')
    close_project_form.addEventListener('click', () => {
        dialog.close();
        resetForm('add-project-form')
    })
}


function saveProjectFormEvent(){
    const dialog = document.querySelector(".add-a-project");
    const save_project_form = dialog.querySelector('.save')
    save_project_form.addEventListener('click', () => {
        const edit_status = dialog.querySelector('#edit-status')
        if (edit_status.value == false){
            if (createProjectFromValidForm() != false) {
                displayProjectsWithToDos(projects,true)
                displayProjectsInSidebar(projects)
                dialog.close();
                resetForm('add-project-form')
            }
        } else {
            const project = searchProject(dialog.dataset.projectName)
            const project_to_do = project.searchToDo(dialog.dataset.projectDescription)
            if (editProjectFromValidForm(project,project_to_do) != false) {
                displayProjectsWithToDos(projects,true)
                displayProjectsInSidebar(projects)
                dialog.close();
                resetForm('add-project-form')
            }
        }
        
    })
}


function projectCreationFormValidation() {
    const project_name = document.getElementById('project-name')
    if (project_name.value.trim() != ''){
        if (searchProject(project_name.value) == false){
            return true
        } else {
            alert ('This project: ' + project_name.value + ' already exists. Please use a new project name!')
        }
    } else {
        alert('Please enter valid project name!')
    }
    return false
}

function projectEditFormValidation() {
    const name = document.getElementById('project-name')
    const description = document.getElementById('to-do-description')
    if (name.value.trim() != '' && description.value.trim() != ''){
        return true
    } else {
        alert('Please enter valid updated information!')
    }
    return false
}




function editProjectFromValidForm(project,project_to_do){
    const name = document.getElementById('project-name')
    const description = document.getElementById('to-do-description')
    const due = document.getElementById('to-do-due')
    const priority = document.querySelector('input[name="priority"]:checked')
    const status = document.querySelector('input[name="status"]:checked')
    if (projectEditFormValidation() == true) {
        if (name.value != ''){
            project.projectName = name.value
        }
        if (description.value != ''){
            project_to_do.description = description.value
        }
        if (due.value != ''){
            project_to_do.due_date_time = Project.validDateTimeFormat(due.value)
        }
        if (priority.value != ''){
            project_to_do.priority = priority.value
        }
        if (status.value != ''){
            project_to_do.to_do_status = status.value
        }
        return true
    }
    return false

}

function createProjectFromValidForm(){
    const description = document.getElementById('to-do-description')
    const due = document.getElementById('to-do-due')
    const priority = document.querySelector('input[name="priority"]:checked')
    const status = document.querySelector('input[name="status"]:checked')
    const project_name = document.getElementById('project-name')
    if (projectCreationFormValidation() == true) {
        if (description.value != ''){
            const newProject = new Project.Project(project_name.value)
            if (priority == null) {
                if (status == null) {
                    newProject.addNewToDo(description.value,due.value)
                } else {
                    newProject.addNewToDo(description.value,due.value,null,status.value)
                }
            } else {
                if (status == null) {
                    newProject.addNewToDo(description.value,due.value,priority.value)
                } else {
                    newProject.addNewToDo(description.value,due.value,priority.value,status.value)
                }
            }
            projects.push(newProject)
            return true
        } else {
            const newProject = new Project.Project(project_name.value)
            projects.push(newProject)
            return true
        }
    }
    return false
}

function displayProjectsInSidebar(projects){
    sortProjects(projects)
    const my_projects = document.querySelector('.my-projects')
    my_projects.innerHTML = ''
    for (let project of projects) {
        project.sortToDosByStatus()
        const my_project = document.createElement('button')
        my_project.classList.add('project')
        let project_completed = true
        for (let to_do of project.projectToDo) {
            if (to_do.to_do_status != 'done'){
                project_completed = false
                break
            }
        }
        if (project_completed == true) {
            my_project.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px"><title>tooltip-check</title><path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.11 2.9 18 4 18H8L12 22L16 18H20C21.11 18 22 17.11 22 16V4C22 2.9 21.11 2 20 2M10.46 14L6.96 10.5L8.37 9.08L10.46 11.17L15.64 6L17.05 7.41L10.46 14Z" /></svg>' + project.projectName
        } else {
            my_project.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px"><title>tooltip-text</title><path d="M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M5,5V7H19V5H5M5,9V11H15V9H5M5,13V15H17V13H5Z" /></svg>' + project.projectName
        }
        my_project.addEventListener('click', () => {
            displayProjectsWithToDos([project],false)
        })
        my_projects.appendChild(my_project)
    }
}

function createAProjectEvent(){
    const create_a_project = document.querySelector('.create-a-project')
    const dialog = document.querySelector(".add-a-project")
    const edit_status = dialog.querySelector('#edit-status')
    create_a_project.addEventListener('click', () => {
        edit_status.value = false
        dialog.showModal();
    })
}    

function displayFilteredProjectsEvents(projects){
    const header = document.getElementById('header')
    const suppliment_title = document.createElement('div')
    suppliment_title.classList.add('suppliment-title')
    const due_today = document.getElementById('due_today')
    const due_this_week = document.getElementById('due_this_week')
    const due_this_month = document.getElementById('due_this_month')
    const currentDateTime = new Date()
    
    due_today.addEventListener('click', () => {
        const due_end = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), 23, 59, 59)
        displayProjectsWithToDos(projectsFilteredByDue(projects, due_end),false) 
        suppliment_title.textContent = '(Due Today)'
        header.appendChild(suppliment_title)
    })
    due_this_week.addEventListener('click', () => {
        const due_end = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate() + 7, 23, 59, 59)
        displayProjectsWithToDos(projectsFilteredByDue(projects, due_end),false) 
        suppliment_title.textContent = '(Due This Week)'
        header.appendChild(suppliment_title)
    })
    due_this_month.addEventListener('click', () => {
        const due_end = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth() + 1, currentDateTime.getDate(), 23, 59, 59)
        displayProjectsWithToDos(projectsFilteredByDue(projects, due_end),false) 
        suppliment_title.textContent = '(Due This Month)'
        header.appendChild(suppliment_title)
    })
    
}

function displayAllProjectsEvent(projects){
    const show_all = document.querySelector('.show-all-dues')
    show_all.addEventListener('click', () => {
        displayProjectsWithToDos(projects, true)
    })
}

function displayProjectsWithToDos(projects,isDashboard) {
    sortProjects(projects)
    const display = document.querySelector('.display')
    display.innerHTML = ''
    const suppliment_title = document.querySelector('.suppliment-title')
    if (suppliment_title != null) {
        suppliment_title.innerHTML = ''
    }
    let projectIndex = 0
    for (let project of projects){
        project.sortToDosByStatus()
        const card = createProjectCard(project,isDashboard,projectIndex)
        display.appendChild(card)
        projectIndex++
    }
}

function createProjectCard(project,isDashboard,projectIndex){
    const card = document.createElement('fieldset')
    card.classList.add('card')
    const project_name = document.createElement('legend')
    project_name.classList.add('project_name')
    project_name.value = project.projectName
    project_name.textContent = project.projectName
    card.appendChild(project_name)

    // Edit a project buttons: add button and delete button
    const edit_buttons = document.createElement('div')
    edit_buttons.classList.add('edit_project_buttons')
    card.appendChild(edit_buttons)

    // Add a new to do task button
    const add_button = document.createElement('button')
    add_button.classList.add('add_new_to_do')
    add_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>'
    edit_buttons.appendChild(add_button)
    add_button.addEventListener('click', () => {
        let to_do_index = 0
        const display = document.querySelector('.display')
        display.innerHTML = ''
        const card = document.createElement('fieldset')
        card.classList.add('card')
        display.appendChild(card)
        const project_name = document.createElement('legend')
        project_name.classList.add('project_name')
        project_name.value = project.projectName
        project_name.textContent = project.projectName
        card.appendChild(project_name)
        const add_to_do_button = document.createElement('button')
        add_to_do_button.classList.add('add_to_do_button')
        add_to_do_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="30px" width="30px"><title>plus</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>'
        add_to_do_button.addEventListener('click', () => {
            createNewTableRowEvent(project,to_do_index)
            to_do_index++
        })
        card.appendChild(add_to_do_button)

        // Create a table to display existing to dos and add new to dos
        const table = document.createElement('div')
        table.classList.add('table')
        card.appendChild(table)
        // Create table's head
        const table_head = document.createElement('thead')
        table.appendChild(table_head)
        const head_row = document.createElement('tr')
        table_head.appendChild(head_row)
        const header_description = document.createElement('th')
        header_description.scope = 'col'
        header_description.textContent = 'To Do Task Description'
        head_row.appendChild(header_description)
        const header_due = document.createElement('th')
        header_due.scope = 'col'
        header_due.textContent = 'Due On'
        head_row.appendChild(header_due)
        const header_priority = document.createElement('th')
        header_priority.scope = 'col'
        header_priority.textContent = 'Priority'
        head_row.appendChild(header_priority)
        const header_status = document.createElement('th')
        header_status.scope = 'col'
        header_status.textContent = 'Status'
        head_row.appendChild(header_status)
        // Create table's body
        const table_body = document.createElement('tbody')
        table_body.classList.add('table_body')
        table.appendChild(table_body)
        // Fill out table with projects' data
        const current_project_to_dos = searchProject(project.projectName).projectToDo
        for(let todo of current_project_to_dos){
            const table_row = document.createElement('tr')
            table_body.appendChild(table_row)
            const to_do_description = document.createElement('th')
            to_do_description.scope = 'row'
            table_row.appendChild(to_do_description)
            const to_do_due = document.createElement('td')
            to_do_due.textContent = formatDueDateTime(todo.due_date_time)
            table_row.appendChild(to_do_due)
            const to_do_priority = document.createElement('td')
            to_do_priority.textContent = todo.priority[0].toUpperCase() + todo.priority.substring(1)
            table_row.appendChild(to_do_priority)
            const to_do_status = document.createElement('td')
            let to_do_status_text
            if (todo.to_do_status == 'to_do'){
                to_do_status_text = 'To Do'
            } else if (todo.to_do_status == 'doing'){
                to_do_status_text = 'Doing'
            } else if (todo.to_do_status == 'done'){
                to_do_status_text = 'Done'
            }
            to_do_status.textContent = to_do_status_text
            table_row.appendChild(to_do_status)
        }

    })
    // Delete the project button
    const delete_button = document.createElement('button')
    delete_button.classList.add('delete_project')
    delete_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>'
    edit_buttons.appendChild(delete_button)
    delete_button.addEventListener('click', () => {
        const result = confirm('Do you want to delete this project? Please note that you will lose all to do tasks under this project once you delete it.')
        if (result == true) {
            const delete_index = projects.findIndex(current_project => current_project.projectName == project.projectName)
            if (delete_index != -1){
                projects.splice(delete_index,1)
            }
            displayProjectsWithToDos(projects,true)
            displayProjectsInSidebar(projects)
        }
    })

    const ul = document.createElement('ul')
    ul.classList.add('project_to_dos')
    let taskIndex = 0
    for (let project_task of project.projectToDo){
        const li = createToDoListItem(project_task, isDashboard, projectIndex, taskIndex);
        ul.appendChild(li)
        taskIndex ++
    }
    card.appendChild(ul)
    return card
}





function createToDoDescription(project_task, projectIndex, taskIndex){
    const to_do_description = document.createElement('input')
    to_do_description.type = 'checkbox'
    to_do_description.id = \`description\${projectIndex}-\${taskIndex}\`
    to_do_description.name = 'description'
    to_do_description.value = project_task.description
    if (project_task.to_do_status == 'done'){
        to_do_description.checked = true
    }
    to_do_description.addEventListener('click', () => {
        updateToDoStatus(project_task, to_do_description);
        displayProjectsInSidebar(projects)        
    })
    return to_do_description;
}

function updateToDoStatus(project_task, to_do_description){
    const project_name = to_do_description.parentElement.parentElement.parentElement.firstChild.value
    const project_to_be_changed = searchProject(project_name)
    if (project_to_be_changed != false) {
        const index = project_to_be_changed.projectToDo.findIndex(task => task.description == project_task.description);
        if (index !== -1) {
            project_to_be_changed.projectToDo[index].to_do_status = to_do_description.checked ? 'done' : 'to_do'
            updateToDoStatusLabel(to_do_description, project_task)
        }
    }
}

function updateToDoStatusLabel(to_do_description){
    const label = to_do_description.parentElement.querySelector('label');
    if (label) {
        const statusDiv = label.querySelector('.status');
        if (statusDiv) {
            statusDiv.textContent = 'Status: ' + (to_do_description.checked ? 'Done' : 'To Do');
        }
    }
}



function formatDueDateTime(dateTime) {
    if (dateTime.getTime() == new Date(8640000000000000).getTime()) {
        return 'Never Due'
    } else {
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        return dateTime;
    }
}


function createToDoLabel(project_task,isDashboard,projectIndex,taskIndex) {
    const label = document.createElement('label')
    label.htmlFor = \`description\`
    
    if (isDashboard == true){
        label.textContent = project_task.description
    } else {
        const due_date_time = formatDueDateTime(project_task.due_date_time)
        const priority = project_task.priority[0].toUpperCase() + project_task.priority.substring(1)
        let priority_color = ''
        let priority_font = 'font-family: cursive, Chalkduster, fantasy'
        let priority_weight = 'bold'
        if (priority == 'High') {
            priority_color = 'red'
        } else if (priority == 'Normal') {
            priority_color = 'blue'
        } else if (priority == 'Low') {
            priority_color = 'green'
        }
        let to_do_status
        if (project_task.to_do_status == 'to_do'){
            to_do_status = 'To Do'
        } else if (project_task.to_do_status == 'doing'){
            to_do_status = 'Doing'
        } else if (project_task.to_do_status == 'done'){
            to_do_status = 'Done'
        }
        label.innerHTML = 
        project_task.description +
        '<div>' + 'Due On: ' + due_date_time + '</div>' +
        '<div>' + 'Priority: ' + priority + '</span>' + '</div>' +
        '<div class="status">' + 'Status: ' + to_do_status + '</div>';
    }
    return label
}


function createDeleteButton(to_do_description){
    const delete_button = document.createElement('button')
    delete_button.classList.add('deleteBtn')
    delete_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>'
    delete_button.addEventListener('click', () => {
        const result = confirm('Do you want to delete this task?')
        if (result == true){
            const target_project_name = to_do_description.parentElement.parentElement.parentElement.firstChild.value
            const target_project = searchProject(target_project_name)
            target_project.deleteToDo(to_do_description.value)
            displayProjectsWithToDos(projects,true)
        }
    })
    return delete_button
}

function createEditButton(project_task,to_do_description){
    const edit = document.createElement('button')
    edit.classList.add('editBtn')
    edit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>'
    edit.addEventListener('click', () => {
        openEditToDoDialog(project_task,to_do_description)
    })
    
    return edit
}

function openEditToDoDialog(project_task,to_do_description){
    const dialog = document.querySelector(".add-a-project")
    dialog.showModal();
    const target_project_name = to_do_description.parentElement.parentElement.parentElement.firstChild.value
    const project_name = dialog.querySelector('#project-name')
    const description = dialog.querySelector('#to-do-description')
    const due = dialog.querySelector('#to-do-due')
    const priority_buttons = dialog.querySelectorAll('input[name="priority"]')
    const status_buttons = dialog.querySelectorAll('input[name="status"]')
    const edit_status = dialog.querySelector('#edit-status')
    edit_status.value = true;
    project_name.value = target_project_name
    description.value = project_task.description
    due.value = project_task.due_date_time.getFullYear() + '-' + String(project_task.due_date_time.getMonth() + 1).padStart(2,'0') + '-' + String(project_task.due_date_time.getDate()).padStart(2,'0') + 'T' + String(project_task.due_date_time.getHours()).padStart(2,'0') + ':' + String(project_task.due_date_time.getMinutes()).padStart(2,'0')
    priority_buttons.forEach(priority_button => {
        if (priority_button.value == project_task.priority){
            priority_button.checked = true
        }
    })
    status_buttons.forEach(status_button => {
        if (status_button.value == project_task.to_do_status){
            status_button.checked = true
        }
    })
    dialog.dataset.projectName = project_name.value
    dialog.dataset.projectDescription = description.value

}


function createToDoListItem(project_task, isDashboard, projectIndex, taskIndex) {
    const li = document.createElement('li')
    const to_do_description = createToDoDescription(project_task, projectIndex, taskIndex)
    const label = createToDoLabel(project_task, isDashboard, projectIndex, taskIndex)
    const edit = createEditButton(project_task,to_do_description)
    const delete_button = createDeleteButton(to_do_description)

    li.appendChild(to_do_description)
    li.appendChild(label)
    li.appendChild(edit)
    li.appendChild(delete_button)

    return li
}
`;

// Parse the code
const parsed = acorn.parse(code, { ecmaVersion: 2020 });

console.log(parsed);