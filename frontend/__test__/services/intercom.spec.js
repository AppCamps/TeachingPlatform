import { expect } from '../chai_helper';

import factory from '../__factories__';

import { bootIntercom, updateIntercom, shutdownIntercom } from '../../services/intercom';

const prevIntercom = global.Intercom;
const intercomAppId = process.env.INTERCOM_APP_ID;
let callParams = null;

describe('intercom', () => {
  beforeEach(() => {
    global.Intercom = function intercomMock(...args) {
      callParams = args;
    };
    process.env.INTERCOM_APP_ID = 'intercomAppId';
  });

  afterEach(() => {
    process.env.INTERCOM_APP_ID = intercomAppId;
    callParams = null;
    global.Intercom = prevIntercom;
  });

  describe('bootIntercom', () => {
    it('boots with user info', () => {
      const params = factory.build('user', { fullName: 'test test' });
      bootIntercom(params);
      expect(callParams).to.deep.equal([
        'boot',
        {
          app_id: 'intercomAppId',
          user_id: params.id,
          email: params.email,
          name: params.fullName,
          user_hash: params.intercomHash,
          created_at: params.createdAt,
          school_classes_count: params.schoolClassesCount,
          custom_launcher_selector: '.custom-intercom-launcher',
        },
      ]);
    });
  });

  describe('updateIntercom', () => {
    it('updats without user info', () => {
      updateIntercom();
      expect(callParams).to.deep.equal(['update']);
    });
  });

  describe('shutdownIntercom', () => {
    it('shuts down intercom', () => {
      shutdownIntercom();
      expect(callParams).to.deep.equal(['shutdown']);
    });
  });
});
