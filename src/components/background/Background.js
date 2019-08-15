import React, { Component } from 'react';
import './index.scss';
import backImg from '../../assets/images/background.png';
import backImgBlur from '../../assets/images/background-blur.png';
import backImgWithLogoBlur from '../../assets/images/background-with-logo-blur.png';



class Background extends Component 
{
    render() {
        let sectionStyle = {
            backgroundImage: "url(" + (this.props.signup ? backImgWithLogoBlur : (this.props.blur ? backImgBlur : backImg)) + ")",
        };
        return (
            <div className='mgsc-back' style={sectionStyle} ref="mgscback"></div>
        );
    }
}

export default Background;