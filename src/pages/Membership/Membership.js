import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Background } from '../../components';
import logo from '../../assets/images/signup_logo.png';
import btnClose from '../../assets/images/IconsClose.png';

import $ from 'jquery'; 

class Membership extends Component 
{

    setContentHeight(){
        let hei = $(window).height();
        if(hei > $('#root').height()){
            $('.mgsc-back').css('height', hei + 'px');
        }else {
            $('.mgsc-back').css('height', '');
        }
    }

    componentDidUpdate(){
        this.setContentHeight();
    }

    componentDidMount(){
        $(window).resize(function(){
            this.setContentHeight();
        }.bind(this));
        this.setContentHeight();
    }

    render() {
        return (
            <div className="signup">
                <Background blur signup/>
                <div className="main-content" align="center">
                    <div className="btn-close">
                        <Link to="/"><img src={btnClose} alt=""/></Link>
                    </div>
                    <img src={logo} className="signup-logo" alt=""/>
                    <div className="user-form">
                        <div className="tky" align="center">
                            <span className="tky">Thank you</span>
                            <div className="tky-desc">
                                <span>Your prospect membership application has been sent successfully.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Membership;