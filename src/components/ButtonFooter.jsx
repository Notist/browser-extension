import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  container: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: 'rgb(255, 204, 128)',
    margin: 5,
  },
};

const ButtonFooter = props => (
  <div style={styles.container}>
    <FlatButton
      label={props.secondaryText}
      onClick={props.onSecondaryClicked}
    />
    <FlatButton
      label={props.primaryText}
      style={styles.primaryButton}
      onClick={props.onPrimaryClicked}
    />
  </div>
);

ButtonFooter.propTypes = {
  primaryText: PropTypes.string.isRequired,
  onPrimaryClicked: PropTypes.func.isRequired,
  secondaryText: PropTypes.string.isRequired,
  onSecondaryClicked: PropTypes.func.isRequired,
};

export default ButtonFooter;
