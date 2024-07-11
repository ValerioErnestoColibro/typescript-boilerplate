export class User {
  username: string;
  email: string;
  password: string;
  primaryKeyUser: string;
  constructor(email: string, password: string) {
    this.username = email;
    this.email = email;
    this.password = password;
    this.primaryKeyUser = Math.random().toString();
  }
}
