export class Task {
  public id!: number;
  public title!: string;
  public done!: boolean;

  constructor() {
    this.title = '';
  }
}
