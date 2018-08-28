import React from 'react';
import Ionicon from 'react-ionicons'

export default class Error extends React.Component {
    messages = {
        disconnected: 'User has disconnected',
        connection: 'There\'s a problem with connection',
        closed: 'Connection closed, someone might be already playing with that person',
        error: 'An error occured, please try again',
    }

    render() {
        return (
            <div className="stage error-stage">
                <div className="icon">
                    <Ionicon icon="ios-close-circle-outline" color="#000000" fontSize="86px" />
                </div>
                <h3>{this.messages[(this.props.type || 'error')]}</h3>
            </div>
        );
    }
}