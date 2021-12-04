import {User} from "./user";
import {TaskGroup} from "./task-group";

export class Project {
  public uuid!: string;
  public creationDate!: Date;
  public creator!: string;
  public title!: string;
  public description!: string;
  public trackFlag!: boolean;
  public users!: User;
  public taskGroups!: TaskGroup[];

  constructor() {
    this.title = '';
  }
}
