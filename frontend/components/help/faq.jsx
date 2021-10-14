import React from "react";
import PropTypes from "prop-types";

import style from "./style.scss";

const FAQ = (props, { t }) => (
  <div className={style.container}>
    <h1>{t("Frequently asked questions")}</h1>
    <div className={style.contentContainer}>
      <p className={style.question}>Wie können sich Schüler einloggen?</p>
      <p className={style.answer}>
        Gar nicht. Die Plattform ist nur für Lehrkräfte.
      </p>

      <p className={style.question}>Wie finanziert ihr euch?</p>
      <p className={style.answer}>
        Wir sind gemeinnützig und arbeiten mit Stiftungen zusammen. Deshalb ist
        unser Angebot für Lehrkräfte und andere Personen aus dem Bildungsbereich
        kostenlos.
      </p>

      <p className={style.question}>Wieso muss man Klassen anlegen?</p>
      <p className={style.answer}>
        Hilfreich für dich: wenn du Klassen anlegst, siehst du wie weit du mit
        einem Kurs bist. Und du behältst den Überblick bei mehreren Klassen.
      </p>
      <p className={style.answer}>
        Hilfreich für uns: durch die angelegten Klassen wissen wir, wie viele
        Schülerinnen und Schüler wir erreichen. Je mehr wir erreichen, desto
        einfacher ist es eine Finanzierung über Stiftungen zu bekommen.
      </p>

      <p className={style.question}>
        Für welche Altersstufen sind die Unterlagen geeignet?
      </p>
      <p className={style.answer}>
        Das kommt auf die Unterlagen an. Bei den jeweiligen Unterlagen steht
        unsere Empfehlung dabei.
      </p>

      <p className={style.question}>
        Unter welcher Lizenz stehen die Unterlagen?
      </p>
      <p className={style.answer}>
        Die Lernkarten stehen unter CC-BY-SA Lizenz.
      </p>
    </div>
  </div>
);

FAQ.propTypes = {};
FAQ.defaultProps = {};
FAQ.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default FAQ;
