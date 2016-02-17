import React from 'react';

var User = React.createClass({

  render: function () {
    var url = 'https://facebook.com/' + this.props.fb_id;
    var imgSrc = 'http://graph.facebook.com/' + this.props.fb_id + '/picture?';
    return (
      <a href={url} target="_blank" className="active-user">
        { this.props.showAvatar ? <img src={imgSrc} width="20" height="20"/> : null}
        <span className="green-dot"/>
        <span>{this.props.firstName}</span> <span>{this.props.lastName}</span>
      </a>
    );
  }
});

export default User;
