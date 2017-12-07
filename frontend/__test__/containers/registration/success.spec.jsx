import { push } from 'react-router-redux';

import { expect } from '../../chai_helper';

import { mapStateToProps, mapDispatchToProps } from '../../../containers/registration/success';

describe('Registration Success Container', () => {
  describe('mapStateToProps', () => {
    it('has only tested keys', () => {
      const props = mapStateToProps({ registration: { firstName: 'Hanna' } });

      expect(Object.keys(props)).to.deep.eql(['firstName']);
    });

    describe('user', () => {
      it('defaults to null', () => {
        const props = mapStateToProps({ registration: { firstName: null } });

        expect(props.firstName).to.eql(null);
      });

      it('returns last user', () => {
        const props = mapStateToProps({ registration: { firstName: 'Hanna' } });

        expect(props.firstName).to.deep.eql('Hanna');
      });
    });
  });

  describe('mapDispatchToProps', () => {
    it('has only tested keys', () => {
      const props = mapDispatchToProps(() => {});

      expect(Object.keys(props)).to.deep.eql(['redirectToRegistrationPage']);
    });

    it('redirectToRegistrationPage', () => {
      const actions = mapDispatchToProps(action => action);

      expect(actions.redirectToRegistrationPage()).to.deep.eql(push('/registration'));
    });
  });
});
