import './style.css';


let projects = [];


class Project {
    constructor(project_name,project_to_do){
        this.project_name = toCapitalized(project_name)
        this.project_to_do = project_to_do
    };
    get projectName (){
        return this.project_name
    };
    set projectName (value){
        if (value != '') {
            this.project_name = toCapitalized(value)
        }
    };
    get projectToDo (){
        return this.project_to_do
    };
    set projectToDo (value){
        this.project_to_do = value
    };
    sortToDosByDescription(){
        this.project_to_do.sort((a,b) => {
            if (a.description < b.description) return -1;
            if (a.description > b.description) return 1;
            return 0;
        })
    }
    sortToDosByPriority(){
        const priorityOrder = { 'high': 1, 'normal': 2, 'low': 3 };
        this.project_to_do.sort((a,b) => {
            if (priorityOrder[a.priority] < priorityOrder[b.priority]) return -1;
            if (priorityOrder[a.priority] > priorityOrder[b.priority]) return 1;
            return 0;
        })
    }
    sortToDosByStatus(){
        const statusOrder = { 'to_do': 1, 'doing': 2, 'done': 3 };
        this.project_to_do.sort((a,b) => {
            if (statusOrder[a.to_do_status] < statusOrder[b.to_do_status]) return -1;
            if (statusOrder[a.to_do_status] > statusOrder[b.to_do_status]) return 1;
            return 0;
        })
    }
    getToDosByDue(due_start, due_end) {
        const filtered_todos = this.project_to_do.filter(to_do => {
            return (to_do.due_date_time.getTime() <= due_end.getTime() && to_do.due_date_time.getTime() >= due_start.getTime());
        });
        if (filtered_todos.length > 0) {
            return new Project(this.projectName, filtered_todos)
        } else {
            return false
        }
    }
    getToDosByPriority(priority_value) {
        let projectToDos = this.project_to_do.filter(to_do => {
            return to_do.priority.toLowerCase() == priority_value.toLowerCase();
        });
        if (projectToDos.length > 0) {
            return new Project(this.projectName, projectToDos)
        } else {
            return false
        }
    }
    getToDosByStatus(status_value) {
        let projectToDos = this.project_to_do.filter(to_do => {
            return to_do.to_do_status.toLowerCase() == status_value.toLowerCase();
        });

        if (projectToDos.length > 0) {
            return new Project(this.projectName, projectToDos)
        } else {
            return false
        }
    }
}


class ToDo {
    constructor(description, due_date_time  = new Date(8640000000000000), priority = 'low', to_do_status = 'to_do', sub_to_do = {}){
        this.description = description
        this.due_date_time = due_date_time
        this.priority = priority
        this.to_do_status = to_do_status
        this.sub_to_do = sub_to_do
    };
    get properties (){
        return {
            description: this.description,
            due_date_time: this.due_date_time,
            priority: this.priority,
            to_do_status: this.to_do_status,
            sub_to_do: this.sub_to_do
        }
    }
    set properties ({description, due_date_time, priority, to_do_status, sub_to_do}){
        if (description != undefined){
            this.description = description;
        }
        if (due_date_time != undefined){
            this.due_date_time = due_date_time;
        }
        if (priority != undefined){
            this.priority = priority;
        }
        if (to_do_status != undefined){
            this.to_do_status = to_do_status;
        }
        if (sub_to_do != undefined){
            this.sub_to_do = sub_to_do;
        }
    }
    editToDo(description, due_date_time, priority, to_do_status){
        this.description = description
        this.due_date_time = due_date_time
        this.priority = priority
        this.to_do_status = to_do_status

    }
};



function __init__(){
    displayProjectsInSidebar(projects)
    createAProjectEvent()
    closeAddProjectFormEvent()
    saveProjectFormEvent()
    displayProjectsWithToDos(projects,true)
    displayFilteredProjectsEvents()
    displayAllProjectsEvent()
}


function toCapitalized(value){
    let words = value.trim().split(' ')
    words = words.filter((word) => {
        if (word != '') {return word}
    })
    words = words.map((word) => {
        word = word[0].toUpperCase() + word.substring(1)
        return word
    })
    return (words.join(' '))
}

function sortProjects(projects){
    projects.sort((a,b) => {
        if (a.projectName < b.projectName) return -1;
        if (a.projectName > b.projectName) return 1;
        return 0;
    })
}



function displayProjectsInSidebar(projects){
    const my_projects = document.querySelector('.my-projects')
    my_projects.innerHTML = ''
    sortProjects(projects)
    for (let project of projects) {
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
            const project_to_do = searchToDo(dialog.dataset.projectDescription,project)
            if (editProjectFromValidForm(project,project_to_do) != false) {
                displayProjectsWithToDos(projects,true)
                displayProjectsInSidebar(projects)
                dialog.close();
                resetForm('add-project-form')
            }
        }
        
    })
}

function validDateTimeFormat(datetime){
    datetime = datetime.split('T')
    const date = datetime[0].split('-')
    const time = datetime[1].split(':')
    return (new Date(date[0],date[1] - 1,date[2],time[0],time[1]))
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
            project_to_do.due_date_time = validDateTimeFormat(due.value)
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
            const todo = new ToDo(description.value);
            if (due.value != '') {
                todo.due_date_time = validDateTimeFormat(due.value)
            }
            if (priority != null) {
                todo.priority = priority.value
            }
            if (status != null) {
                todo.to_do_status = status.value
            }
            const newProject = new Project(project_name.value,[todo])
            projects.push(newProject)
            return true
        } else {
            const newProject = new Project(project_name.value,[])
            projects.push(newProject)
            return true
        }
    }
    return false
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

function displayFilteredProjectsEvents(){
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

function displayAllProjectsEvent(){
    const show_all = document.querySelector('.show-all-dues')
    show_all.addEventListener('click', () => {
        displayProjectsWithToDos(projects, true)
    })
}



function searchProject(project_name){
    for (let project of projects){
        if (project.projectName == toCapitalized(project_name)){
            return project
        }
    }
    return false
}

function searchToDo(to_do_description,project){
    for (let todo of project.projectToDo){
        if (todo.description == to_do_description){
            return todo
        }
    }
    return false
}


function displayProjectsWithToDos(projects,isDashboard) {
    const display = document.querySelector('.display')
    display.innerHTML = ''
    const suppliment_title = document.querySelector('.suppliment-title')
    if (suppliment_title != null) {
        suppliment_title.innerHTML = ''
    }
    sortProjects(projects)
    let projectIndex = 0
    for (let project of projects){
        const card = createProjectCard(project,isDashboard,projectIndex)
        display.appendChild(card)
        projectIndex++
    }
}

function createProjectCard(project, isDashboard,projectIndex){
    const card = document.createElement('fieldset')
    card.classList.add('card')
    const project_name = document.createElement('legend')
    project_name.classList.add('project_name')
    project_name.value = project.projectName
    project_name.textContent = project.projectName
    card.appendChild(project_name)
    const ul = document.createElement('ul')
    ul.classList.add('project_to_dos')
    project.sortToDosByStatus()
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
    to_do_description.id = `description${projectIndex}-${taskIndex}`
    to_do_description.name = 'description'
    to_do_description.value = project_task.description
    if (project_task.to_do_status == 'done'){
        to_do_description.checked = true
    }
    to_do_description.addEventListener('click', () => {
        updateToDoStatus(project_task, to_do_description);
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

function createToDoLabel(project_task,isDashboard,projectIndex,taskIndex) {
    const label = document.createElement('label')
    label.htmlFor = `description${projectIndex}-${taskIndex}`
    let to_do_status
    if (isDashboard == true){
        label.textContent = project_task.description
    } else {
        if (project_task.to_do_status == 'to_do'){
            to_do_status = 'To Do'
        } else if (project_task.to_do_status == 'doing'){
            to_do_status = 'Doing'
        } else if (project_task.to_do_status == 'done'){
            to_do_status = 'Done'
        }
        label.innerHTML = 
        project_task.description +
        '<div>' + 'Due On: ' + formatDueDateTime(project_task.due_date_time) + '</div>' +
        '<div>' + 'Priority: ' + project_task.priority[0].toUpperCase() + project_task.priority.substring(1) + '</div>' +
        '<div class="status">' + 'Status: ' + to_do_status + '</div>';
    }
    return label
}

function createEditButton(project_task,to_do_description){
    const edit = document.createElement('button')
    edit.classList.add('editBtn')
    edit.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="15px" width="15px" ><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>'
    edit.addEventListener('click', () => {
        openEditToDoDialog(project_task,to_do_description)
    })
    
    return edit
}

function openEditToDoDialog(project_task,to_do_description){
    const dialog = document.querySelector(".add-a-project")
    const target_project_name = to_do_description.parentElement.parentElement.parentElement.firstChild.value
    const project_name = dialog.querySelector('#project-name')
    const description = dialog.querySelector('#to-do-description')
    const due = dialog.querySelector('#to-do-due')
    const priority = dialog.querySelector('input[name="priority"]')
    const status = dialog.querySelector('input[name="status"]')
    const edit_status = dialog.querySelector('#edit-status')
    edit_status.value = true;
    project_name.value = target_project_name
    description.value = project_task.description
    due.value = project_task.due_date_time.getFullYear() + '-' + String(project_task.due_date_time.getMonth() + 1).padStart(2,'0') + '-' + String(project_task.due_date_time.getDate()).padStart(2,'0') + 'T' + String(project_task.due_date_time.getHours()).padStart(2,'0') + ':' + String(project_task.due_date_time.getMinutes()).padStart(2,'0')
    priority.checked = project_task.priority
    status.checked = project_task.to_do_status

    dialog.dataset.projectName = project_name.value
    dialog.dataset.projectDescription = description.value

    const save_button = dialog.querySelector('.save')
    const close_button = dialog.querySelector('.close')

}


function createToDoListItem(project_task, isDashboard, projectIndex, taskIndex) {
    const li = document.createElement('li')
    const to_do_description = createToDoDescription(project_task, projectIndex, taskIndex)
    const label = createToDoLabel(project_task, isDashboard, projectIndex, taskIndex)
    const edit = createEditButton(project_task,to_do_description)

    li.appendChild(to_do_description)
    li.appendChild(label)
    li.appendChild(edit)

    return li
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
        return `${month}/${day}/${year} ${hours}:${minutes}`;
    }
}
        


const work = new Project("Work", [
    new ToDo("Prepare quarterly report", new Date(2024, 3, 15, 10, 0, 0), "high", "to_do"),
    new ToDo("Schedule team meeting", new Date(2024, 3, 10, 14, 0, 0), "normal", "doing"),
    new ToDo("Review client proposal", new Date(2024, 2, 22, 17, 0, 0), "low", "done")
])

projects.push(work);
// console.log(work.getToDosByDue(new Date(), new Date(2024, 2, 21, 23, 59, 59)))

projects.push(new Project("Home Renovation", [
    new ToDo("Purchase paint for living room", new Date(2024, 2, 8, 17, 0, 0), "normal", "done"),
    new ToDo("Install new light fixtures", new Date(2024, 3, 15, 10, 0, 0), "high", "to_do"),
    new ToDo("Hire plumber for bathroom repairs", new Date(2024, 3, 12, 15, 0, 0), "high", "doing")
]));

projects.push(new Project("Fitness Goals", [
    new ToDo("Go for a morning run", new Date(2024, 3, 10, 7, 0, 0), "normal", "to_do"),
    new ToDo("Attend yoga class", new Date(2024, 3, 12, 18, 0, 0), "low", "doing"),
    new ToDo("Track daily calorie intake", new Date(2024, 2, 22, 19, 0, 0), "high", "done")
]));

projects.push(new Project("Study Plan", [
    new ToDo("Read Chapter 1 of Biology textbook", new Date(2024, 2, 22, 18, 0, 0), "high", "done"),
    new ToDo("Complete Math assignment", new Date(2024, 3, 15, 17, 0, 0), "normal", "to_do"),
    new ToDo("Review notes for History test", new Date(2024, 3, 20, 10, 0, 0), "high", "doing")
]));

projects.push(new Project("Vacation Planning", [
    new ToDo("Book flight tickets", new Date(2024, 3, 12, 15, 0, 0), "high", "to_do"),
    new ToDo("Reserve accommodation", new Date(2024, 3, 15, 12, 0, 0), "high", "doing"),
    new ToDo("Create itinerary", new Date(2024, 2, 21, 15, 0, 0), "normal", "doing")
]));

projects.push(new Project("Side Project", [
    new ToDo("Brainstorm project ideas", new Date(2024, 3, 8, 14, 0, 0), "low", "done"),
    new ToDo("Research market potential", new Date(2024, 3, 12, 12, 0, 0), "normal", "to_do"),
    new ToDo("Create prototype", new Date(2024, 3, 18, 10, 0, 0), "high", "doing")
]));

const newProjectB = new Project('   project B  ', [new ToDo('description 1', new Date(2024,2,20,23,0,0),'normal','to_do'),new ToDo('description 2', new Date(2024,3,20,15,0,0),'low','to_do')])
const newProjectC = new Project('project C  ', [new ToDo('description a', new Date(2024,2,25,3,0,0),'high','done'),new ToDo('description c', new Date(2024,2,21,3,0,0),'high','doing'), new ToDo('description b', new Date(2024,2,23,3,0,0),'low','to_do')])
projects.push(newProjectB)
projects.push(newProjectC)


__init__()


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





// function createAForm(isMainForm) {
//     const main_container = document.querySelector('.maincontent')
//     const dialog = document.createElement('dialog')
//     dialog.classList.add('add-a-project')
//     main_container.appendChild(dialog)

//     const form = document.createElement('form')
//     form.id = 'add-project-form'
//     dialog.appendChild(form)

//     const ul = document.createElement('ul')
//     form.appendChild(ul)

//     const li_project_name = document.createElement('li')
//     ul.appendChild(li_project_name)

//     const label_project_name = document.createElement('label')
//     label_project_name.htmlFor = 'project_name'
//     label_project_name.innerText = 'Project Name: '
//     li_project_name.appendChild(label_project_name)

//     const input_project_name = document.createElement('input')
//     input_project_name.type = 'text'
//     input_project_name.id = 'project_name'
//     input_project_name.name = 'project_name'
//     input_project_name.vplaceholder = 'Project A'
//     li_project_name.appendChild(input_project_name)

//     const ul_project_to_do = document.createElement('ul')
//     ul.appendChild(ul_project_to_do)

//     const p = document.createElement('p')
//     p.textContent = 'Create A To Do List Under This Project (Optional):'
//     ul_project_to_do.appendChild(p)


// }
// createAForm(true)
