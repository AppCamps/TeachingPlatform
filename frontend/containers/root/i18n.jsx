import React from 'react';
import PropTypes from 'prop-types';

import flatMap from 'lodash.flatmap';
import deepForceUpdate from 'react-deep-force-update';

import { connect } from 'react-redux';

class I18n extends React.Component {
  constructor(props) {
    super(props);
    this.trans = this.trans.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lang !== this.props.lang) {
      deepForceUpdate(this);
    }
  }

  // Check if the text need replace some params
  params(text, params) {
    let translation = text;

    function replaceText(_text, _key, _element) {
      const textArray = _text.split(`{${_key}}`);
      return [textArray[0], React.cloneElement(_element, { key: _key }), textArray[1]];
    }

    if (params !== undefined) {
      for (const k in params) {
        if (!['string', 'number'].includes(typeof params[k])) {
          if (typeof translation === 'string') {
            translation = replaceText(translation, k, params[k]);
          } else if (Array.isArray(translation)) {
            translation = flatMap(translation, (_text) => {
              if (typeof _text !== 'string') {
                return _text;
              }

              const reg = new RegExp(`{${k}}`, 'g');
              if (_text.match(reg)) {
                return replaceText(_text, k, params[k]);
              }
              return _text;
            });
          }
        } else {
          const reg = new RegExp(`{${k}}`, 'g');
          translation = translation.replace(reg, params[k]);
        }
      }
    }
    return translation;
  }

  // Main method for translating texts
  trans(textKey, params, comment) {
    const langMessages = this.props.translations[this.props.lang];

    if (langMessages === undefined) {
      return this.params(textKey, params);
    }

    const message = langMessages[textKey];
    if (message === undefined || message === '') {
      return this.params(textKey, params);
    }

    return this.params(message, params);
  }

  getChildContext() {
    return {
      t: this.trans,
    };
  }

  render() {
    return this.props.children;
  }
}

I18n.childContextTypes = {
  t: PropTypes.func.isRequired,
};

I18n.propTypes = {
  translations: PropTypes.object.isRequired,
};

export default connect(state => ({
  lang: state.i18nState.lang,
}))(I18n);
