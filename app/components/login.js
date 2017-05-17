var React = require('react');

var Login = React.createClass({
	handleLogin: function() {
		//simple form validation,
		//should be changed to a proper form and event targets in the future
		var plr1 = document.getElementById('player1-name').value;
		var plr2 = document.getElementById('player2-name').value;

		//if any of the inputs is empty, focus it back and set class to "required"
		//as CSS class "required" makes it glow red
		if(plr1.length == 0) {
			document.getElementById('player1-name').focus();
			document.getElementById('player1-name').setAttribute('class', 'required');
			return;
		}

		if(plr2.length == 0) {
			document.getElementById('player2-name').focus();
			document.getElementById('player2-name').setAttribute('class', 'required');
			return;
		}

		this.props.startg(plr1, plr2);
	},

	//remove the class "required" if the input changes
	handleInputChange: function(e) {
		var targ = e.target;
		if(targ.getAttribute('class') == "required")
			targ.setAttribute('class', "");
	},

	render: function() {
		return (
			<div id="login">
				<h4>First player name:</h4>
				<input onChange={this.handleInputChange} id="player1-name" type="text" />
				<h4>Second player name:</h4>
				<input onChange={this.handleInputChange} id="player2-name" type="text" /><br />
				<button onClick={this.handleLogin}>START</button>
			</div>
		)
	}
});

module.exports = Login;