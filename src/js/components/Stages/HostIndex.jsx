import React from 'react';
import Ionicon from 'react-ionicons'

export default class HostIndex extends React.Component {
    getGameLink() {
        return `${window.location.origin}?room=${this.props.room}`
    }

    render() {
        return (
            <div className="stage stage-clientindex">
                <div className="icon">
                    <Ionicon icon="ios-sync" color="#000000" fontSize="86px" rotate={true} />
                </div>
                <h2>Waiting for client to connect</h2>
                <If condition={this.props.room}>
                    <pre className="room-url">{this.getGameLink()}</pre>
                </If>
                <p>Copy the above link and send it to the person you'd like to play with!</p>
            </div>
        );
    }
}