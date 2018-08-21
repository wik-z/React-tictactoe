import React from 'react';
import Ionicon from 'react-ionicons';

export default class ChooseName extends React.Component {
    state = {
        name: '',
    }

    onSubmit(e) {
        e.preventDefault();

        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.name);
        }
    }
    
    render() {
        return (
            <div className="stage choose-name-stage">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            required={true} 
                            autoFocus={true} 
                            className="form-input" 
                            placeholder="What's your name?" 
                            value={this.state.name} 
                            onChange={((e) => { this.setState({ name: e.target.value }); }).bind(this)} 
                        />
                    </div>
                    <div className="form-group form-submit">
                        <button type="submit" className="btn">Play!</button>
                    </div>
                </form>
            </div>
        );
    }
}