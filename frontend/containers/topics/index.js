import { connect } from 'react-redux';

import { selectTopic } from '../../actions/topics';
import { fetchCourses } from '../../actions/courses';
import { fetchPreparationMaterials } from '../../actions/preparation-materials';
import Topics from '../../components/topics';

import { topicsSelector } from '../../selectors/shared/topic';

function mapStateToProps(state, { params }) {
  const topics = topicsSelector(state, params);

  return {
    topics,
    selectedTopic: topics.find(topic => topic.slug === params.topicSlug),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCourses: () => dispatch(fetchCourses()),
    fetchPreparationMaterials: () => dispatch(fetchPreparationMaterials()),
    selectTopic: id => dispatch(selectTopic(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Topics);
