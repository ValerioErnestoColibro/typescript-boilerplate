export class User {
  username: string;
  email: string;
  password: string;
  primaryKeyUser: number;
  constructor(email: string, password: string) {
    this.username = email;
    this.email = email;
    this.password = password;
    this.primaryKeyUser = Math.random();
  }
}
