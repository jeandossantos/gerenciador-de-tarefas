import { User } from '../../../src/entities/user.mjs';

export class UserDataBuilder {
  constructor() {
    this.userData = {
      id: 1,
      name: 'teste da silva',
      email: 'test@test.com',
      initials: 'TS',
      password: 'password',
      confirmPassword: 'password',
    };
  }

  static validUser() {
    return new UserDataBuilder();
  }

  withInvalidId() {
    this.userData.id = 'invalid-id';

    return this;
  }

  withInvalidName() {
    this.userData.name = 'test123';

    return this;
  }

  withInvalidEmail() {
    this.userData.email = 'test=test.com';

    return this;
  }

  withInvalidInitials() {
    this.userData.initials = 'J%';

    return this;
  }

  withInvalidPassword() {
    this.userData.password = '12345';

    return this;
  }

  withInvalidConfirmPassword() {
    this.userData.confirmPassword = 'invalid-password';

    return this;
  }

  build() {
    return new User(this.userData);
  }
}
