import { connect } from 'react-redux';

import {
  classesSelector,
  classVisibilitySelector,
  openClassIdsSelector,
} from '../../selectors/classes';
import { archiveClass, fetchClasses, showAllClasses, showTopClasses, toggleClass } from '../../actions/classes';
import { fetchCourses } from '../../actions/courses';
import { downloadCertificate } from '../../actions/certificate';

/* eslint-disable import/no-named-as-default */
import Classes from '../../components/classes';
/* eslint-enable import/no-named-as-default */

export function mapStateToProps(state) {
  return {
    classes: classesSelector(state),
    showAll: classVisibilitySelector(state),
    openedClassIds: openClassIdsSelector(state),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    archiveClass: (klassId) => dispatch(archiveClass(klassId)),
    fetchClasses: () => dispatch(fetchClasses()),
    fetchCourses: () => dispatch(fetchCourses()),
    setShowAll: () => dispatch(showAllClasses()),
    setShowTop: () => dispatch(showTopClasses()),
    toggleClass: klass => dispatch(toggleClass(klass)),
    downloadCertificate: courseSchoolClass => dispatch(downloadCertificate(courseSchoolClass)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Classes);
