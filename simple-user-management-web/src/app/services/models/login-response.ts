export class LoginResponse {
  email: string;
  tokenType: string;
  token: string;

  constructor(email: string, tokenType: string, token: string) {
    this.email = email;
    this.tokenType = tokenType;
    this.token = token;
  }
}
