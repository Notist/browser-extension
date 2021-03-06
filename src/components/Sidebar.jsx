import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import { Card, CardText } from 'material-ui/Card';
import AnnotationListContainer from '../containers/AnnotationListContainer';
import AnnotationFormContainer from '../containers/AnnotationFormContainer';
import HeaderBar from './HeaderBar';

const Sidebar = props => (
  <Drawer
    open={!props.collapsed}
    openSecondary
    containerStyle={{
      backgroundColor: '#E0F7FA',
      width: '98%',
      transform: 'none',
      overflow: props.collapsed ? 'hidden' : 'auto',
    }}
  >
    <HeaderBar
      onOpenToggle={props.onCollapsedToggle}
      isOpen={!props.collapsed}
    />
    <Card hidden={props.isAuthenticated}>
      <CardText>
        <a
          target="_parent"
          href={'/* @echo FRONTEND_HOST *//login'}
          style={{ color: 'blue', textDecoration: 'none' }}
        >Login</a> to create and edit annotations.
      </CardText>
    </Card>
    { !props.collapsed && <AnnotationFormContainer /> }
    { !props.collapsed && <AnnotationListContainer /> }
  </Drawer>
);

Sidebar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onCollapsedToggle: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
};

export default Sidebar;
