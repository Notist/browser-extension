import React, { PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import { Card, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import AnnotationListContainer from '../containers/AnnotationListContainer';
import AnnotationFormContainer from '../containers/AnnotationFormContainer';

export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    injectTapEventPlugin();
    this.state = { open: true };
  }

  render() {
    return (
      <Drawer
        open={this.state.open}
        openSecondary
        containerStyle={{ width: '300px', right: this.state.open ? 0 : '20px' }}
      >
        <AppBar
          title="Notist"
          iconElementLeft={
            <IconButton onClick={() => this.setState({ open: !this.state.open })}>
              {this.state.open ? <NavigationChevronRight /> : <NavigationChevronLeft />}
            </IconButton>
          }
        />
        <Card hidden={this.props.isAuthenticated}>
          <CardText>
            login to create and edit annotations.
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
