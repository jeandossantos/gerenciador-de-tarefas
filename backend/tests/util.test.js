import { jest, test, describe, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';

import { Util } from '../src/utils/util.mjs';

describe('#Util password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('#encryptPassword should encrypt the password and return it', () => {
    const password = 'password';

    const result = Util.encryptPassword(password);

    const isMatch = bcrypt.compareSync(password, result);

    expect(isMatch).toBe(true);
  });
});
