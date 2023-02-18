export class User {
  constructor({
    id,
    name,
    initials,
    email,
    password,
    admin,
    createdAt,
    updatedAt,
    deletedAt,
  }) {
    this.id = id || undefined;
    this.name = name || undefined;
    this.initials = initials || undefined;
    this.email = email || undefined;
    this.password = password || undefined;
    this.admin = admin || undefined;
    this.createdAt = createdAt || undefined;
    this.updatedAt = updatedAt || undefined;
    this.deletedAt = deletedAt || undefined;
  }
}
