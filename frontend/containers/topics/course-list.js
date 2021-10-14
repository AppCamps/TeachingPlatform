import { connect } from "react-redux";

import CourseList from "../../components/topics/course-list";

import {
  topicBySlugSelector,
  coursesSelector,
} from "../../selectors/topics/course-list";

export function mapStateToProps(state, { params: { topicSlug } }) {
  return {
    topic: topicBySlugSelector(state, topicSlug),
    courses: coursesSelector(state, topicSlug),
  };
}

export default connect(mapStateToProps)(CourseList);
