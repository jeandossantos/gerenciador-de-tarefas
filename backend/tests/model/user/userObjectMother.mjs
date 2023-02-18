import { UserDataBuilder } from './userDataBuilder.mjs';

export class UserObjectMother {
  static valid() {
    return UserDataBuilder.validUser().build();
  }

  static withInvalidName() {
    return UserDataBuilder.validUser().withInvalidName().build();
  }

  static withInvalidEmail() {
    return UserDataBuilder.validUser().withInvalidEmail().build();
  }
}
