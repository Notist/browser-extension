import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import ContentReply from 'material-ui/svg-icons/content/reply';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { connect } from 'react-redux';
import { deleteAnnotation } from '../actions';

const styles = {
  replyBar: {
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
};

const ReplyBar = props => (
  <div style={styles.replyBar}>
    <IconButton
      onClick={props.onReplyClicked}
      tooltip="Reply"
    >
      <ContentReply />
    </IconButton>
    <IconButton
      tooltip="Delete"
      disabled={props.authorId !== props.userId}
      onClick={() => props.onDeleteClicked(props.annotationId)}
    >
      <ActionDelete />
    </IconButton>
  </div>
);

ReplyBar.propTypes = {
  onReplyClicked: PropTypes.func.isRequired,
  authorId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  annotationId: PropTypes.string.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    userId: state.user._id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onDeleteClicked: annotationId => dispatch(deleteAnnotation(annotationId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ReplyBar);
