import React, { Component } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  postMessage,
  readConversation,
  userTypingMessage,
} from "../../store/utils/thunkCreators";

const styles = {
  root: {
    justifySelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  handleChange = async (event) => {
    this.setState({
      text: event.target.value,
    });
    if (event.target.value.length > 0) {
      await this.props.userTypingMessage(true, this.props.conversationId);
    } else {
      await this.props.userTypingMessage(false, this.props.conversationId);
    }
  };

  handleBlur = async (event) => {
    await this.props.userTypingMessage(false, this.props.conversationId);
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: this.props.otherUser.id,
      conversationId: this.props.conversationId,
      sender: this.props.conversationId ? null : this.props.user,
    };

    await this.props.postMessage(reqBody);
    this.setState({
      text: "",
    });
    await this.props.userTypingMessage(false, this.props.conversationId);
    await this.props.readConversation({ id: reqBody.conversationId });
  };

  render() {
    const { classes } = this.props;
    return (
      <form
        className={classes.root}
        onSubmit={this.handleSubmit}
        onBlur={this.handleBlur}
      >
        <FormControl fullWidth hiddenLabel>
          <FilledInput
            classes={{ root: classes.input }}
            disableUnderline
            placeholder="Type something..."
            value={this.state.text}
            name="text"
            onChange={this.handleChange}
          />
        </FormControl>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    readConversation: (id) => {
      dispatch(readConversation(id));
    },
    userTypingMessage: (bool, id) => {
      userTypingMessage(bool, id);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Input));
