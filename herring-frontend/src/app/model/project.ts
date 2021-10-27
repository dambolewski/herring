export class Project {
  public uuid!: string;
  public creationDate!: Date;
  public creator!: string;
  public title!: string;
  public description!: string;
  public trackFlag!: boolean;

  constructor() {
    this.title = '';
  }
}
