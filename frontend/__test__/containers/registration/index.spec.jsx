import { expect } from '../../chai_helper';

import { mapStateToProps, mapDispatchToProps, __RewireAPI__ as containerRewire } from '../../../containers/registration';

describe('Registration Container', () => {
  describe('mapStateToProps', () => {
    describe('selectedRole', () => {
      it('returns selected row from formValues', () => {
        const props = mapStateToProps({
          form: {
            registration: {
              values: {
                role: 'role_feuerwehrmann',
              },
            },
          },
        });

        expect(props.selectedRole).to.eql('role_feuerwehrmann');
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('createUser', () => {
      const createUserMock = jest.fn();
      containerRewire.__Rewire__('createUser', createUserMock);

      const dispatch = action => action;
      const actions = mapDispatchToProps(dispatch);

      const user = { firstName: 'mario' };
      actions.createUser(user);
      expect(createUserMock.mock.calls[0]).to.eql([user]);
    });
  });
});
