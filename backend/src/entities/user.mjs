export class User {
  constructor({
    id = undefined,
    name,
    initials,
    email,
    password,
    confirmPassword,
  }) {
    this.id = id;
    this.name = name;
    this.initials = initials;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}
