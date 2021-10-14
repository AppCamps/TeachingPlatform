import React from "react";
import PropTypes from "prop-types";
import {
  Router,
  Route,
  Redirect,
  IndexRoute,
  IndexRedirect,
} from "react-router";

import { requireLoggedInUser, requireLoggedOutUser } from "./services/auth";

import App from "./containers/app";
import Login from "./containers/login";
import Logout from "./containers/logout";
import Registration from "./containers/registration";
import RegistrationSuccess from "./containers/registration/success";
import PasswordReset from "./containers/password-reset";
import PasswordResetForm from "./containers/password-reset/reset-form";
import EmailConfirmationValidateToken from "./containers/email-confirmation/validate-token";
import EmailConfirmationRequest from "./containers/email-confirmation";
import Dashboard from "./containers/dashboard";
import ShowCardCodePage from "./containers/cards/show-code";
import InputCardCodePage from "./containers/cards/input-code";
import Cards from "./containers/cards";
import Topics from "./containers/topics";
import CourseLesson from "./containers/course-lesson";
import LegacyCourseLessonRedirect from "./containers/courses/redirect";
import LegacyPreparationsRedirect from "./containers/preparations/redirect";
import PreparationMaterials from "./containers/topics/preparation-materials";
import CourseList from "./containers/topics/course-list";
import ClassLesson from "./containers/class-lesson";
import Classes from "./containers/classes";
import CreateClass from "./containers/create-class";
import EditClass from "./containers/edit-class";
import EditUser from "./containers/edit-user";
import EditUserPassword from "./containers/edit-user/password";
import EditUserLocality from "./containers/edit-user/locality";
import Help from "./components/help";
import HelpPlatformTips from "./components/help/platform-tips";
import HelpFAQ from "./components/help/faq";
import HelpContact from "./components/help/contact";
import HelpCertificates from "./components/help/certificates";
import Posts from "./containers/posts";

import NotFound from "./components/shared/not-found";

function Routes({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <Route path="karten" component={InputCardCodePage} />
        <Route path="karten/:code" component={Cards} />
        <Route path="karten-code/:encoded" component={ShowCardCodePage} />
        <Route path="login" component={Login} />
        <Route path="logout" component={Logout} />
        <Route component={requireLoggedOutUser}>
          <Route path="registration">
            <Route path="success" component={RegistrationSuccess} />
            <IndexRoute component={Registration} />
          </Route>
          <Route path="password-reset">
            <Route path=":passwordResetToken" component={PasswordResetForm} />
            <IndexRoute component={PasswordReset} />
          </Route>
          <Route path="email-confirmation">
            <Route
              path=":emailConfirmationToken"
              component={EmailConfirmationValidateToken}
            />
            <IndexRoute component={EmailConfirmationRequest} />
          </Route>
        </Route>
        <Route component={requireLoggedInUser}>
          <Route component={Dashboard}>
            <Route path="classes">
              <Route path="new" component={CreateClass} />
              <Route path=":classId/edit" component={EditClass} />
              <Route
                path=":classId/:courseSlug/:lessonSlug"
                component={ClassLesson}
              />
              <IndexRoute component={Classes} />
            </Route>
            <Route path="courses">
              <Route
                path=":courseSlug/:lessonSlug"
                component={LegacyCourseLessonRedirect}
              />
              <IndexRedirect to="/topics" />
            </Route>
            <Route path="preparations">
              <Route path=":topicSlug" component={LegacyPreparationsRedirect} />
              <IndexRedirect to="/topics" />
            </Route>
            <Route path="topics(/:topicSlug)">
              <Route path=":courseSlug/:lessonSlug" component={CourseLesson} />
              <Route component={Topics}>
                <Route path="preparations" component={PreparationMaterials} />
                <IndexRoute component={CourseList} />
              </Route>
            </Route>
            <Route path="edit-user">
              <Route path="locality" component={EditUserLocality} />
              <Route path="password" component={EditUserPassword} />
              <IndexRoute component={EditUser} />
            </Route>
            <Route path="help" component={Help}>
              <Route path="platform-tips" component={HelpPlatformTips} />
              <Route path="faq" component={HelpFAQ} />
              <Route path="contact" component={HelpContact} />
              <Route path="certificates" component={HelpCertificates} />
            </Route>
            <Redirect path="skills" to="posts" />
            <Route path="posts" component={Posts} />
            <IndexRedirect to="classes" />
          </Route>
        </Route>
        <IndexRedirect to="classes" />
        <Route path="**" component={NotFound} />
      </Route>
    </Router>
  );
}

Routes.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Routes;
