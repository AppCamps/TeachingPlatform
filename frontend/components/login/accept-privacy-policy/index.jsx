import React, { Component } from "react";
import PropTypes from "prop-types";
import autobind from "autobind-decorator";

import Container from "../../shared/container";
import Button from "../../shared/button";

import style from "./style.scss";

class AcceptPrivacyPolicy extends Component {
  constructor() {
    super();
    this.state = {
      isSubmitting: false,
    };
  }

  @autobind
  handleAcceptButtonClicked() {
    const { user, acceptPrivacyPolicy } = this.props;

    this.setState({ isSubmitting: true });

    acceptPrivacyPolicy(user).catch(() =>
      this.setState({ isSubmitting: false })
    );
  }

  render() {
    const { declinePrivacyPolicy } = this.props;
    const { isSubmitting } = this.state;

    return (
      <div className={style.container}>
        <Container>
          <h1 className={style.heading}>
            Unsere Datenschutzbestimmungen haben sich geändert
          </h1>
          <div className={style.privacyPolicyChange}>
            <p>
              Wir bitten dich, dir kurz Zeit zu nehmen und die wichtigsten
              Punkte unserer aktualisierten Datenschutzerklärung durchzulesen.
            </p>

            <p>
              Bisher war die Datenschutzerklärung Bestandteil des Impressums.
              Nun haben wir eine separate und ausführliche Datenschutzerklärung.
              Wir listen dort u.a. Dienste auf, die wir einsetzen. Auf der neuen
              Plattform setzen wir beispielsweise Intercom ein, ein Tool, um mit
              dir via Chat oder E-Mail zu kommunizieren.
            </p>

            <p>
              Wir nutzen diese Dienste, um mit dir zu kommunizieren bzw. das
              Produkt weiter zu verbessern. Daher ist es erforderlich, dass du
              den Datenschutzbestimmungen zustimmst, sonst kannst du unsere neue
              Plattform leider nicht benutzen. Du kannst deine Einwilligung
              jederzeit mit Wirkung für die Zukunft widerrufen.
            </p>

            <p>
              <a
                href="https://www.appcamps.de/privacypolicy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hier findest du unsere neuen Datenschutzbestimmungen
              </a>
            </p>
          </div>
          <div className={style.actions}>
            <Button
              isSecondary
              onClick={declinePrivacyPolicy}
              disabled={isSubmitting}
            >
              Datenschutzbestimmungen ablehnen
            </Button>
            <Button
              isAction
              onClick={this.handleAcceptButtonClicked}
              disabled={isSubmitting}
            >
              Datenschutzbestimmungen annehmen
            </Button>
          </div>
        </Container>
      </div>
    );
  }
}

AcceptPrivacyPolicy.propTypes = {
  declinePrivacyPolicy: PropTypes.func.isRequired,
  acceptPrivacyPolicy: PropTypes.func.isRequired,
  user: PropTypes.shape({ id: PropTypes.string }).isRequired,
};

export default AcceptPrivacyPolicy;
