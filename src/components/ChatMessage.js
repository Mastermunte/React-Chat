import React from 'react';
import User from './User';

var ChatMessage = React.createClass({
  render: function () {
    var align = this.props.alignRight ? 'right' : 'left';
    var delivered = this.props.delivered ? '' : 'not-delivered';
    var user = this.props.user;
    return (
      <div className="chat-message">
        <div className={'align-' + align + ' ' + delivered}>
          <User firstName={user.first_name} lastName={user.last_name} fb_id={user.fb_id} showAvatar />
          <div className="body">{this.props.body}</div>
          <div className="date">{this.props.date}</div>
        </div>
      </div>
    );
  }
});

export default ChatMessage;
