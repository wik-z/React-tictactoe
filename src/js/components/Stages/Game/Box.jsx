import React from 'react';

export default class Box extends React.Component {
    render() {
        return (
            <div className="game-board-box" onClick={this.props.onClick}>
                <div className="inner">
                    {this.props.content}
                </div>
            </div>
        );
    }
}