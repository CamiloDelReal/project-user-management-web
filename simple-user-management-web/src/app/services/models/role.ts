export class Role {
  id: number;
  name: string

  static readonly ADMINISTRATOR = "Administrator";
  public static readonly GUEST = "Guest";

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
