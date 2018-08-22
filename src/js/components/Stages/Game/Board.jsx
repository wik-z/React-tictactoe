import React from 'react';

import Box from './Box';

export default class Board extends React.Component {
    render() {
        return (
            <div className="game-board">
                <div className="inner">
                    <For each="box" index="index" of={this.props.board}>
                        <Box key={index} />
                    </For>
                </div>
            </div>
        )
    }
}