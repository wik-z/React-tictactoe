var React = require('react');


//Making it a component is a useless effort, as it 
//could be just a single button in the Game component,
//but it's a props-functions practice at least
var Reset = React.createClass({
	render: function() {
		return <button onClick={this.props.click}>RESET</button>
	}
});

module.exports = Reset;