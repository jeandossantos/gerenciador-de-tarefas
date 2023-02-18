import { UserDataBuilder } from './userDataBuilder.mjs';

export class UserObjectMother {
  static valid() {
    return UserDataBuilder.validUser().build();
  }

  static withInvalidId() {
    return UserDataBuilder.validUser().withInvalidId().build();
  }

  static withInvalidName() {
    return UserDataBuilder.validUser().withInvalidName().build();
  }

  static withInvalidEmail() {
    return UserDataBuilder.validUser().withInvalidEmail().build();
  }

  static withInvalidInitials() {
    return UserDataBuilder.validUser().withInvalidInitials().build();
  }

  static withInvalidPassword() {
    return UserDataBuilder.validUser().withInvalidPassword().build();
  }

  static withInvalidConfirmPassword() {
    return UserDataBuilder.validUser().withInvalidConfirmPassword().build();
  }
}
