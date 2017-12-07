import { SubmissionError } from 'redux-form';

import moxios from 'moxios';

import { expect } from '../../chai_helper';
import factory from '../../__factories__';

import UserRegistrationSerializer from '../../../serializers/user/registration';
import ClassSerializer from '../../../serializers/class';
import LocalitySerializer from '../../../serializers/locality';

import {
  getSession,
  createSession,
  getCourses,
  getPreparationMaterials,
  createUser,
  updateUser,
  getClasses,
  createClass,
  updateClass,
  updateCompletedLessonsRelation,
  deleteCompletedLessonsRelation,
  createLocality,
  passwordResetRequest,
  passwordReset,
  initializeApi,
} from '../../../services/api';

import * as createSessionFixtures from '../../fixtures/api/createSession';
import * as getCoursesFixtures from '../../fixtures/api/getCourses';
import * as getPreparationMaterialsFixtures from '../../fixtures/api/getPreparationMaterials';
import * as getClassesFixtures from '../../fixtures/api/getClasses';
import * as createClassFixtures from '../../fixtures/api/createClass';
import * as createUserFixtures from '../../fixtures/api/createUser';
import * as updateUserFixtures from '../../fixtures/api/updateUser';
import * as createLocalityFixtures from '../../fixtures/api/createLocality';

/* eslint-disable-next-line max-len */
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcGNhbXBzLmRldiIsImlhdCI6MTQ3MjgyMTI3MCwiZXhwIjoxNDcyOTA3NjcwLCJzdWIiOjkyMn0.TWsdWez_m9gfzN5dFKkkshhWjN_pXymtnnPeryRbIX8';

describe('Api', () => {
  let dispatchMock;
  /* eslint-disable no-console */
  const prevLog = console.log;
  beforeEach(() => {
    console.log = () => true;
    dispatchMock = jest.fn();
    initializeApi({ dispatch: dispatchMock });
    moxios.install();
  });

  afterEach(() => {
    console.log = prevLog;
    moxios.uninstall();
  });
  /* eslint-enable no-console */

  describe('createSession', () => {
    describe('success', () => {
      it('returns api token and user', (done) => {
        moxios.stubRequest('/api/session', {
          method: 'POST',
          headers: {},
          status: 201,
          responseText: createSessionFixtures.successResponse,
        });

        const requestData = JSON.parse(createSessionFixtures.requestData);
        createSession(requestData.data.attributes)
          .then((response) => {
            expect(response).to.deep.equal(createSessionFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/session');
            expect(JSON.parse(request.config.data)).to.deep.equal(requestData);
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });

    describe('failure', () => {
      it('returns api token and user', (done) => {
        moxios.stubRequest('/api/session', {
          method: 'POST',
          headers: {},
          status: 401,
          responseText: createSessionFixtures.errorResponse,
        });

        createSession({ email: 'admin@appcamps.de', password: 'password123' })
          .catch((response) => {
            expect(response).to.deep.equal(JSON.parse(createSessionFixtures.errorResponse).errors);
            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('getSession', () => {
    describe('success', () => {
      it('returns api token and user', (done) => {
        moxios.stubRequest('/api/session', {
          method: 'GET',
          headers: {},
          status: 200,
          responseText: createSessionFixtures.successResponse,
        });

        getSession(token)
          .then((response) => {
            expect(response).to.deep.equal(createSessionFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/session');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });

    describe('failure', () => {
      it('returns api error', (done) => {
        moxios.stubRequest('/api/session', {
          method: 'GET',
          headers: {},
          status: 401,
          responseText: createSessionFixtures.errorResponse,
        });

        getSession('some token')
          .catch((response) => {
            expect(response).to.deep.equal(JSON.parse(createSessionFixtures.errorResponse).errors);
            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('getCourses', () => {
    describe('success', () => {
      it('returns records', (done) => {
        moxios.stubRequest('/api/courses', {
          method: 'GET',
          headers: {},
          status: 200,
          responseText: getCoursesFixtures.successResponse,
        });

        getCourses()
          .then((response) => {
            expect(response).to.deep.equal(getCoursesFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/courses');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('getPreparationMaterials', () => {
    describe('success', () => {
      it('returns records', (done) => {
        moxios.stubRequest('/api/preparation_materials', {
          method: 'GET',
          headers: {},
          status: 200,
          responseText: getPreparationMaterialsFixtures.successResponse,
        });

        getPreparationMaterials()
          .then((response) => {
            expect(response).to.deep.equal(
              getPreparationMaterialsFixtures.normalizedSuccessResponse,
            );

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/preparation_materials');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('createUser', () => {
    const registration = createUserFixtures.user;

    describe('success', () => {
      it('returns user with updated privacy policy', (done) => {
        moxios.stubRequest('/api/user', {
          method: 'POST',
          headers: {},
          status: 201,
          responseText: createUserFixtures.successResponse,
        });

        createUser(registration)
          .then((response) => {
            expect(response).to.deep.equal(createUserFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/user');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            const returnedUser = JSON.parse(request.config.data);
            expect(returnedUser).to.deep.equal(UserRegistrationSerializer.serialize(registration));

            done();
          })
          .catch(done.fail);
      });
    });

    describe('failure', () => {
      it('returns api error', (done) => {
        moxios.stubRequest('/api/user', {
          method: 'POST',
          headers: {},
          status: 422,
          responseText: createUserFixtures.errorResponse,
        });

        createUser(registration)
          .catch((error) => {
            expect(error).to.be.instanceof(SubmissionError);
            expect(error).to.deep.equal(createUserFixtures.normalizedErrorResponse);
            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('updateUser', () => {
    describe('success', () => {
      it('returns user with updated privacy policy', (done) => {
        const user = updateUserFixtures.user;

        moxios.stubRequest('/api/user', {
          method: 'PUT',
          headers: {},
          status: 200,
          responseText: updateUserFixtures.successResponse,
        });

        updateUser(user)
          .then((response) => {
            expect(response).to.deep.equal(updateUserFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();

            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            expect(JSON.parse(request.config.data)).to.deep.equal(
              JSON.parse(updateUserFixtures.requestData),
            );

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('getClasses', () => {
    describe('success', () => {
      it('returns records', (done) => {
        moxios.stubRequest('/api/classes', {
          method: 'GET',
          status: 200,
          responseText: getClassesFixtures.successResponse,
          headers: {},
        });

        getClasses()
          .then((response) => {
            expect(response).to.deep.equal({
              classes: {
                'f70dd28d-39e1-4d4f-b833-d2a8b56c3cc9': {
                  id: 'f70dd28d-39e1-4d4f-b833-d2a8b56c3cc9',
                  resourceType: 'school_class',
                  user: '1184',
                },
              },
            });

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/classes');
            expect(request.config.method).to.eql('get');

            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('createClass', () => {
    describe('success', () => {
      it('returns records', (done) => {
        moxios.stubRequest('/api/classes', {
          method: 'POST',
          status: 201,
          responseText: createClassFixtures.successResponse,
          headers: {},
        });

        /* eslint-disable-next-line react/prefer-es6-class */
        createClass(JSON.parse(createClassFixtures.requestData))
          .then((response) => {
            expect(response).to.deep.equal(createClassFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/classes');

            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');
            expect(JSON.parse(request.config.data)).to.eql(
              JSON.parse(createClassFixtures.requestData),
            );
            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('updateClass', () => {
    describe('success', () => {
      it('returns records', (done) => {
        const schoolClass = factory.build('schoolClass');

        moxios.stubRequest(`/api/classes/${schoolClass.id}`, {
          status: 200,
          responseText: createClassFixtures.successResponse,
          method: 'PUT',
          headers: {},
        });

        const requestData = ClassSerializer.serialize(schoolClass);
        /* eslint-disable react/prefer-es6-class */
        updateClass(schoolClass.id, requestData)
          /* eslint-enable react/prefer-es6-class */
          .then((response) => {
            expect(response).to.deep.equal(createClassFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql(`/api/classes/${schoolClass.id}`);

            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');
            expect(JSON.parse(request.config.data)).to.eql(requestData);

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('updateCompletedLessonsRelation', () => {
    describe('success', () => {
      it('returns records', (done) => {
        const successResponse = createClassFixtures.normalizedSuccessResponse;

        const classId = Object.keys(successResponse.classes)[0];
        const data = JSON.stringify({ some: 'testBody' });
        const path = `/api/classes/${classId}/relationships/completed-lessons`;

        moxios.stubRequest(path, {
          headers: {},
          method: 'PUT',
          status: 200,
          responseText: createClassFixtures.successResponse,
        });

        /* eslint-disable react/prefer-es6-class */
        updateCompletedLessonsRelation(classId, data)
          /* eslint-enable react/prefer-es6-class */
          .then((response) => {
            expect(response).to.deep.equal(successResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql(path);

            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');
            expect(JSON.parse(request.config.data)).to.eql(data);

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('deleteCompletedLessonsRelation', () => {
    describe('success', () => {
      it('returns records', (done) => {
        const successResponse = createClassFixtures.normalizedSuccessResponse;

        const classId = Object.keys(successResponse.classes)[0];
        const data = JSON.stringify({ some: 'testBody' });
        const path = `/api/classes/${classId}/relationships/completed-lessons`;

        moxios.stubRequest(path, {
          method: 'DELETE',
          headers: {},
          status: 200,
          responseText: createClassFixtures.successResponse,
        });

        /* eslint-disable react/prefer-es6-class */
        deleteCompletedLessonsRelation(classId, data)
          /* eslint-enable react/prefer-es6-class */
          .then((response) => {
            expect(response).to.deep.equal(successResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql(path);

            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');
            expect(JSON.parse(request.config.data)).to.eql(data);

            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('createLocality', () => {
    const locality = createLocalityFixtures.locality;

    describe('success', () => {
      it('returns user with updated locality', (done) => {
        moxios.stubRequest('/api/locality', {
          method: 'POST',
          headers: {},
          status: 201,
          responseText: createLocalityFixtures.successResponse,
        });

        createLocality(locality)
          .then((response) => {
            expect(response).to.deep.equal(createLocalityFixtures.normalizedSuccessResponse);

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/locality');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            const returnedUser = JSON.parse(request.config.data);
            expect(returnedUser).to.deep.equal(LocalitySerializer.serialize(locality));

            done();
          })
          .catch(done.fail);
      });
    });

    describe('failure', () => {
      it('returns api error', (done) => {
        moxios.stubRequest('/api/locality', {
          method: 'POST',
          headers: {},
          status: 422,
          responseText: createLocalityFixtures.errorResponse,
        });

        createLocality(locality)
          .then(done.fail)
          .catch((error) => {
            expect(error).to.be.instanceof(SubmissionError);
            expect(error).to.deep.equal(createLocalityFixtures.normalizedErrorResponse);
            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('passwordReset', () => {
    describe('success', () => {
      it('returns nothing', (done) => {
        moxios.stubRequest('/api/password-reset/passwordResetToken', {
          method: 'PUT',
          headers: {},
          status: 204,
        });

        passwordReset({ password: '123', passwordConfirmation: '123' }, 'passwordResetToken')
          .then((response) => {
            expect(response).to.deep.equal({});

            const request = moxios.requests.mostRecent();
            expect(request.url).to.eql('/api/password-reset/passwordResetToken');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });

    describe('failure', () => {
      it('throws new SubmissionError', (done) => {
        const errorResponse = {
          errors: [
            {
              source: { pointer: '/data/attributes/resetPasswordToken' },
              detail: 'is invalid',
            },
          ],
        };

        moxios.stubRequest('/api/password-reset/token', {
          status: 422,
          responseText: JSON.stringify(errorResponse),
          method: 'PUT',
          headers: {},
        });

        passwordReset({ password: 'test', passwordConfirmation: 'test' }, 'token')
          .then(done.fail)
          .catch((error) => {
            expect(error).to.be.instanceof(SubmissionError);
            expect(error.errors).to.deep.equal({
              resetPasswordToken: 'is invalid',
            });
            done();
          })
          .catch(done.fail);
      });
    });
  });

  describe('passwordResetRequest', () => {
    describe('success', () => {
      it('returns nothing', (done) => {
        moxios.stubRequest('/api/password-reset', {
          method: 'POST',
          headers: {},
          status: 202,
        });

        passwordResetRequest({ email: 'test@test.de' })
          .then(() => {
            const request = moxios.requests.mostRecent();

            expect(request.url).to.eql('/api/password-reset');
            expect(request.headers['Content-Type']).to.equal('application/vnd.api+json');

            done();
          })
          .catch(done.fail);
      });
    });
  });
});
