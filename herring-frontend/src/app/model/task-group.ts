import {Task} from "./task"

export class TaskGroup {
  public id!: number;
  public title!: string;
  public done!: boolean;
  public tasks!: Task[];
  public todoTasks!: Task[];
  public doneTasks!: Task[];

  constructor() {
    this.title = '';
  }
}
