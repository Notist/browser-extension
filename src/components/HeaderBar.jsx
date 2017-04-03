import React, { PropTypes } from 'react';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

const HeaderBar = props => (
  <AppBar
    title="Notist"
    iconElementLeft={
      <IconButton onClick={props.onOpenToggle}>
        {props.isOpen ? <NavigationChevronRight /> : <NavigationChevronLeft />}
      </IconButton>
    }
  />
);

HeaderBar.propTypes = {
  onOpenToggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default HeaderBar;