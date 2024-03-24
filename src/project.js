import { ToDo } from './todo.js';

export class Project {
    constructor(project_name,project_to_do = []){
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
    searchToDo(to_do_description){
        for (let todo of this.projectToDo){
            if (todo.description == to_do_description){
                return todo
            }
        }
        return false
    }
    addNewToDo(description, due_date_time, priority, to_do_status){
        const newToDo = new ToDo(description);
        if (due_date_time != '' && due_date_time != null) {
            newToDo.due_date_time = validDateTimeFormat(due_date_time);
        } else {
            newToDo.due_date_time = new Date(8640000000000000)
        }
        if (priority != null && priority != '') {
            newToDo.priority = priority;
        } else {
            newToDo.priority = 'low'
        }
        if (to_do_status != null && to_do_status != '') {
            newToDo.to_do_status = to_do_status;
        } else {
            newToDo.to_do_status = 'to_do'
        }
        this.projectToDo.push(newToDo);
    }
    deleteToDo(description_value){
        const delete_index = this.projectToDo.findIndex(todo => todo.description == description_value)
        if (delete_index != -1){
            this.projectToDo.splice(delete_index,1)
        }
    }

    
}

export function toCapitalized(value){
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

export function validDateTimeFormat(datetime){
    datetime = datetime.split('T')
    const date = datetime[0].split('-')
    const time = datetime[1].split(':')
    return (new Date(date[0],date[1] - 1,date[2],time[0],time[1]))
}

const workToDo = [
    new ToDo("Prepare quarterly report", new Date(2024, 3, 15, 10, 0, 0), "high", "to_do"),
    new ToDo("Schedule team meeting", new Date(2024, 3, 10, 14, 0, 0), "normal", "doing"),
    new ToDo("Review client proposal", new Date(2024, 2, 22, 17, 0, 0), "low", "done")
]
export const work = new Project("Work", workToDo)

const homeRenovationToDo = [
    new ToDo("Purchase paint for living room", new Date(2024, 2, 8, 17, 0, 0), "normal", "done"),
    new ToDo("Install new light fixtures", new Date(2024, 3, 15, 10, 0, 0), "high", "to_do"),
    new ToDo("Hire plumber for bathroom repairs", new Date(2024, 3, 12, 15, 0, 0), "high", "doing")
]
export const homeRenovation = new Project("Home Renovation", homeRenovationToDo)

const fitnessGoalsToDo = [
    new ToDo("Go for a morning run", new Date(2024, 3, 10, 7, 0, 0), "normal", "to_do"),
    new ToDo("Attend yoga class", new Date(2024, 3, 12, 18, 0, 0), "low", "doing"),
    new ToDo("Track daily calorie intake", new Date(2024, 2, 24, 19, 0, 0), "high", "done")
]
export const fitnessGoals = new Project("Fitness Goals", fitnessGoalsToDo)

const studyPlanToDo = [
    new ToDo("Read Chapter 1 of Biology textbook", new Date(2024, 2, 22, 18, 0, 0), "high", "done"),
    new ToDo("Complete Math assignment", new Date(2024, 3, 15, 17, 0, 0), "normal", "to_do"),
    new ToDo("Review notes for History test", new Date(2024, 3, 20, 10, 0, 0), "high", "doing")
]
export const studyPlan = new Project("Study Plan", studyPlanToDo)

const vacationPlanningToDo = [
    new ToDo("Book flight tickets", new Date(2024, 3, 12, 15, 0, 0), "high", "to_do"),
    new ToDo("Reserve accommodation", new Date(2024, 3, 15, 12, 0, 0), "high", "doing"),
    new ToDo("Create itinerary", new Date(2024, 2, 24, 15, 0, 0), "normal", "doing")
]
export const vacationPlanning = new Project("Vacation Planning", vacationPlanningToDo)

export const sideProject = new Project("Side Project", [
    new ToDo("Brainstorm project ideas", new Date(2024, 3, 8, 14, 0, 0), "low", "done"),
    new ToDo("Research market potential", new Date(2024, 3, 12, 12, 0, 0), "normal", "to_do"),
    new ToDo("Create prototype", new Date(2024, 3, 18, 10, 0, 0), "high", "doing")
])

export const newProjectB = new Project('   project B  ', [new ToDo('description 1', new Date(2024,2,20,23,0,0),'normal','to_do'),new ToDo('description 2', new Date(2024,3,20,15,0,0),'low','to_do')])
export const newProjectC = new Project('project C  ', [new ToDo('description a', new Date(2024,2,25,3,0,0),'high','done'),new ToDo('description c', new Date(2024,2,21,3,0,0),'high','doing'), new ToDo('description b', new Date(2024,2,23,3,0,0),'low','to_do')])
