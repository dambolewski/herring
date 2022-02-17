export class Task {
  public id!: number;
  public title!: string;
  public done!: boolean;
  public creationDate!: Date;

  constructor() {
    this.title = '';
  }
}
