import React from 'react';
import Ionicon from 'react-ionicons'

export default class ClientIndex extends React.Component {
    render() {
        return (
            <div className="stage stage-hostindex">
                <div className="icon">
                    <Ionicon icon="ios-sync" color="#000000" fontSize="86px" rotate={true} />
                </div>
                <h2>Connecting to peer</h2>
            </div>
        );
    }
}