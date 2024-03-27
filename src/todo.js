/* eslint-disable eqeqeq */
/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
export class ToDo {
  constructor(
    description,
    due_date_time = new Date(8640000000000000),
    priority = "low",
    to_do_status = "to_do",
    sub_to_do = {},
  ) {
    this.description = description;
    this.due_date_time = due_date_time;
    this.priority = priority;
    this.to_do_status = to_do_status;
    this.sub_to_do = sub_to_do;
  }

  get properties() {
    return {
      description: this.description,
      due_date_time: this.due_date_time,
      priority: this.priority,
      to_do_status: this.to_do_status,
      sub_to_do: this.sub_to_do,
    };
  }

  set properties({
    description,
    due_date_time,
    priority,
    to_do_status,
    sub_to_do,
  }) {
    if (description != undefined) {
      this.description = description;
    }
    if (due_date_time != undefined) {
      this.due_date_time = due_date_time;
    }
    if (priority != undefined) {
      this.priority = priority;
    }
    if (to_do_status != undefined) {
      this.to_do_status = to_do_status;
    }
    if (sub_to_do != undefined) {
      this.sub_to_do = sub_to_do;
    }
  }

  editToDo(description, due_date_time, priority, to_do_status) {
    this.description = description;
    this.due_date_time = due_date_time;
    this.priority = priority;
    this.to_do_status = to_do_status;
  }
}
