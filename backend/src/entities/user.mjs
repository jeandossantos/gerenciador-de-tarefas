export class User {
  constructor({
    id,
    name,
    initials,
    email,
    password,
    confirmPassword,
    deletedAt,
  }) {
    this.id = id || undefined;
    this.name = name || undefined;
    this.initials = initials || undefined;
    this.email = email || undefined;
    this.password = password || undefined;
    this.confirmPassword = confirmPassword || undefined;
    this.deletedAt = deletedAt || undefined;
  }
}
