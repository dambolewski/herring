export class TaskGroup {
  public id!: number;
  public title!: string;
  public shortDescription!: string;
  public tasks!: Task[];

  constructor() {
    this.title = '';
  }
}
