import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import _ from 'underscore';
import MenuItem from 'material-ui/MenuItem';
import GroupFormContainer from '../../containers/GroupFormContainer';

const styles = {
  dropdown: {
    position: 'relative',
    left: 0,
    zIndex: 100,
    display: 'inline-block',
  },
  container: {
    width: '58%',
    display: 'inline-block',
  },
  popover: {
    width: '70%',
  },
  chip: {
    margin: 4,
  },
  chipWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    textAlign: 'left',
    backgroundColor: 'rgb(255, 204, 128)',
  },
  menu: {
    overflowY: 'scroll',
    maxHeight: '180px',
  },
  header: {
    fontFamily: 'inherit',
    fontSize: '20px',
    lineHeight: '20px',
    color: 'inherit',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

class GroupDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
    };
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getSelectedGroups = this.getSelectedGroups.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setButtonRef = this.setButtonRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.getElementById('notist-sidebar').contentWindow.document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.getElementById('notist-sidebar').contentWindow.document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setButtonRef(node) {
    this.toggleButton = node;
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  getSelectedGroups() {
    return this.props.groups.filter(g => _.indexOf(this.props.selectedGroups, g._id) > -1);
  }

  // Detect whether the user clicks outside of the dropdown
  // based on the answer to this stackoverflow post:
  // http://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  handleClickOutside(event) {
    if (this.toggleButton && this.toggleButton.contains(event.target) && !this.state.isCollapsed) {
      return;
    }
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ isCollapsed: true });
    }
  }

  toggleCollapsed() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  handleChange(e, values) {
    this.props.onChange(e, values);
  }

  handleBlur(e) {
    console.log(e.target);
    this.setState({ isCollapsed: true });
  }

  render() {
    return (
      <div>
        <div ref={this.setButtonRef}>
          <FlatButton
            label={this.props.label}
            style={styles.button}
            onClick={this.toggleCollapsed}
            labelPosition="before"
            icon={
              <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            }
          />
        </div>
        {!this.state.isCollapsed &&
        <div
          style={styles.popover}
          ref={this.setWrapperRef}
        >
          <Paper
            zDepth={2}
            style={styles.dropdown}
          >
            <div
              style={styles.header}
              hidden={this.state.isCollapsed || this.props.groups.length === 0}
            >
              <span>{this.props.active ? 'New Group' : 'My groups'}</span>
            </div>
            <Menu
              style={styles.menu}
              multiple
              hidden={this.props.active}
              value={this.props.selectedGroups}
              onChange={this.props.active ? null : this.handleChange}
            >
              {!this.props.active && this.props.groups.map(group => (
                <MenuItem
                  key={group._id}
                  value={group._id}
                  checked={_.indexOf(this.props.selectedGroups, group._id) > -1}
                  primaryText={group.name}
                />
              ))}
            </Menu>
            <div style={{ backgroundColor: this.props.active ? 'white' : '#b6d3d9' }}>
              <GroupFormContainer
                active={this.props.active}
                onNewGroupClicked={this.props.onNewGroupClicked}
              />
            </div>
          </Paper>
        </div>}
        <div style={styles.chipWrapper}>
          {this.getSelectedGroups().map(g =>
            (<Chip
              key={g._id}
              style={styles.chip}
              onRequestDelete={() => this.props.handleChipDelete(g._id, this.props.selectedGroups)}
            >
              {g.name}
            </Chip>))}
        </div>
      </div>
    );
  }
}

GroupDropdown.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    isPublic: PropTypes.bool,
    isPersonal: PropTypes.bool,
  })),
  active: PropTypes.bool.isRequired,
  onNewGroupClicked: PropTypes.func.isRequired,
  handleChipDelete: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedGroups: PropTypes.arrayOf(PropTypes.string),
};

GroupDropdown.defaultProps = {
  groups: [],
  selectedGroups: [],
};

export default GroupDropdown;
