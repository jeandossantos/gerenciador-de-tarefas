import { Util } from '../../src/utils/util.mjs';
import { UserObjectMother } from '../model/user/userObjectMother.mjs';

const user = UserObjectMother.valid();

/** User who will be populated in the database */
export const EXISTING_USER = {
  name: 'Existing User da Silva',
  initials: 'EX',
  email: 'existing-user@example.com',
  password: Util.encryptPassword(user.password),
};
