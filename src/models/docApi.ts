export class DocAPI {
  path: string;
  method: string;
  autenticated: boolean;

  constructor(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    autenticated: boolean
  ) {
    this.path = `/api${path}`;
    this.method = method;
    this.autenticated = autenticated;
  }
}
