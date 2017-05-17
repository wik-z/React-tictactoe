var React = require('react');

var Box = React.createClass({
	defaultProps: { content: "", player: 1 },
	render: function() {
		var content = "box";
		//if the box was already checked with a symbol, put it in
		if(this.props.content != "N") 
			content += " box-" + (this.props.content == "X" ? "X" : "O");

		//if the game is won, highlight the boxes that won this game
		if(this.props.winbox == true) 
			content += " winbox";

		return <div onClick={this.props.clickevent} className={content}></div>
	}
});

//defining all possible patterns of winning
var WinPatterns = [
	[	0,1,2	],
	[	3,4,5	],
	[	6,7,8	],
	[	0,3,6	],
	[	1,4,7	],
	[	2,5,8	],
	[	0,4,8	],
	[	2,4,6	]
];

var Board = React.createClass({
	getInitialState: function() {
		return {
			board: Array(9).fill("N"),
			winfields: Array(3).fill(null)
		};
	},

	checkForWinner: function() {
		var winner = 0;
		var i=0;
		var boardboxes = this.state.board;

		for(; i<8; i++) {
			if(boardboxes[WinPatterns[i][0]] == boardboxes[WinPatterns[i][1]] && boardboxes[WinPatterns[i][1]] == boardboxes[WinPatterns[i][2]] && boardboxes[WinPatterns[i][0]] == boardboxes[WinPatterns[i][2]] && boardboxes[WinPatterns[i][2]] != "N") {
				winner = (boardboxes[WinPatterns[i][0]] == "X" ? 1 : 2);
				break;
			}
		}

		if(winner == 0)
			return false;

		var fields = [
			WinPatterns[i][0],
			WinPatterns[i][1],
			WinPatterns[i][2],
		]

		this.setState({ winfields: fields });

		return winner;
	},

	handleBoxClick: function(i) {
		if(this.props.gameOn == false)
			return;

		var boardboxes = this.state.board;
		if(boardboxes[i] != "N")
			return;

		boardboxes[i] = (this.props.player == 1 ? "X" : "O");
		this.setState({ board: boardboxes });
		var won = this.checkForWinner();
		if(!won)	
			this.props.gameChanged();

		else
			this.props.gameWon(won);
		
	},

	componentWillReceiveProps: function(nextprops) {
		if(this.props.moves != 9 && nextprops.moves == 9) {
			this.props.gameDraw();
			return;
		}

		if(nextprops.reset == true) {
			var wins = Array(3).fill(null)
			var brd = Array(9).fill("N");
			this.setState({ board: brd, winfields: wins });
			this.props.resetCallback();
		}
	},

	checkWinBoxes: function(box) {
		return (this.state.winfields[0] == box || this.state.winfields[1] == box || this.state.winfields[2] == box)
	},

	render: function() {
		var boxes = this.state.board.map((box, i) => <Box winbox={this.checkWinBoxes(i)} clickevent={() => this.handleBoxClick(i)} key={i} content={box} />);
		return <div id="board">{boxes}</div>;
	} 
});

module.exports = {Board, Box};