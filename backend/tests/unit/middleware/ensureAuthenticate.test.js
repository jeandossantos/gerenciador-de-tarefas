import { jest, test, describe, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';

import { ensureAuthenticated } from '../../../src/middleware/ensureAuthenticated.mjs';
import { Util } from '../../../src/utils/util.mjs';
import { UserObjectMother } from '../../model/user/userObjectMother.mjs';

describe('#Ensure User Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  class ResponseMock {
    _status;

    status(status) {
      this._status = status;
      return this;
    }

    end() {
      return;
    }
  }
  test('should return 401 if req.headers does not have a authorization property', () => {
    const request = {
      headers: {},
    };

    const response = new ResponseMock();

    const next = () => {};

    ensureAuthenticated(request, response, next);

    expect(response._status).toBe(Util.STATUS_CODES.Unauthorized);
  });

  test('should return 401 with an invalid Authorization token', () => {
    const request = {
      headers: {
        authorization: 'bearer invalid-token',
      },
    };

    const response = new ResponseMock();

    const next = () => {};

    const verifySpy = jest.spyOn(jwt, 'verify');

    ensureAuthenticated(request, response, next);

    expect(response._status).toBe(Util.STATUS_CODES.Unauthorized);
    expect(verifySpy).toHaveBeenCalled();
  });

  test('should return 200 with a valid Authorization token', () => {
    const { id, email } = UserObjectMother.valid();
    const request = {
      headers: {
        authorization: 'bearer valid-token',
      },
    };

    const response = new ResponseMock();

    const nextSpy = jest.fn(() => {});

    const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue({
      id,
      email,
    });

    ensureAuthenticated(request, response, nextSpy);

    expect(verifySpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();

    expect(request.user_id).toBe(id);
  });
});
