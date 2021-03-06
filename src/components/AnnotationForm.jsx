import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import CommentEditor from './CommentEditor';

const styles = {
  articleText: {
    fontStyle: 'italic',
    borderLeft: 'thick solid #F98C25',
    paddingLeft: 10,
    paddingBottom: 10,
  },
};

const AnnotationForm = props => (
  <Card hidden={!props.isCreatingAnnotation}>
    <CardTitle title="New Annotation" />
    <CardText>
      <div style={styles.articleText} >
        {props.newAnnotation.articleText}
      </div>
    </CardText>
    <CommentEditor
      dispatch={props.dispatch}
      newAnnotation={props.newAnnotation}
      onCommentPost={props.onCommentPost}
      onCommentCancel={props.onFormCancel}
    />
  </Card>
  );

AnnotationForm.propTypes = {
  onCommentPost: PropTypes.func.isRequired,
  onFormCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isCreatingAnnotation: PropTypes.bool.isRequired,
  newAnnotation: PropTypes.shape({
    articleText: PropTypes.string,
    articleURI: PropTypes.string,
    ranges: PropTypes.array,
    groups: PropTypes.array,
  }).isRequired,
};

export default AnnotationForm;
