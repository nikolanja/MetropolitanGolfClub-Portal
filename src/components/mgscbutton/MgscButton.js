import React, { Component } from 'react';
import './index.scss';

class MgscButton extends Component 
{

    render() {
        return (this.props.disabled !== undefined && this.props.disabled === true) ? (
            <button onClick={this.props.onClick} className='mgsc-button' disabled>{this.props.children}</button>
        ) : (
            <button onClick={this.props.onClick} className='mgsc-button'>{this.props.children}</button>
        );
    }
}

export default MgscButton;