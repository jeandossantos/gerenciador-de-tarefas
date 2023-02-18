import { User } from '../../../src/entities/user.mjs';

export class UserDataBuilder {
  constructor() {
    this.userData = {
      name: 'teste da silva',
      email: 'test@test.com',
      initials: 'TS',
      password: 'password',
      confirmedPassword: 'password',
    };
  }

  static validUser() {
    return new UserDataBuilder();
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

  build() {
    Reflect.deleteProperty(this.userData, 'confirmedPassword');

    return new User(this.userData);
  }
}
