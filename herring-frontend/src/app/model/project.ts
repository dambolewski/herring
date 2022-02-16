import {User} from "./user";
import {TaskGroup} from "./task-group";
import {Attachment} from "./attachment";
import {Activity} from "./activity";

export class Project {
  public uuid!: string;
  public creationDate!: Date;
  public creator!: string;
  public title!: string;
  public description!: string;
  public trackFlag!: boolean;
  public users!: User[];
  public taskGroups!: TaskGroup[];
  public attachments!: Attachment[];
  public activities!: Activity[];

  constructor() {
    this.title = '';
  }
}
