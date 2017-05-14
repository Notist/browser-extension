import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import { Card, CardText } from 'material-ui/Card';
import AnnotationListContainer from '../containers/AnnotationListContainer';
import AnnotationFormContainer from '../containers/AnnotationFormContainer';
import HeaderBar from './HeaderBar';

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  render() {
    return (
      <Drawer
        open={this.state.open}
        openSecondary
        containerStyle={{ width: '100%' }}
      >
        <HeaderBar
          onOpenToggle={() => this.setState({ open: !this.state.open })}
          isOpen={this.state.open}
        />
        <Card hidden={this.props.isAuthenticated}>
          <CardText>
            <a
              target="_parent"
              href={'/* @echo FRONTEND_HOST *//login'}
              style={{ color: 'blue', textDecoration: 'none' }}
            >Login</a> to create and edit annotations.
          </CardText>
        </Card>
        <AnnotationFormContainer />
        <AnnotationListContainer />
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};
