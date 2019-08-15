import React, { Component } from 'react';
import { MgscButton } from '../../components';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import backImg from '../../assets/images/background.png';
import './index.scss';

export default class Join extends Component 
{
    render() {
        let bgStyle = {
            background: 'url(' + backImg + ')',
            backgroundSize: 'cover',
            display: 'flex',
            alignItems: 'center',
            height: '100vh',
            margin: 0
        }
        
        return (
            <div style={bgStyle}>
                <div className="join-container">
                    <div className="main-container" align="center">
                        <img src={logo} alt="MGSC logo" /><br />
                        <div className="action">
                            <Link to="/signup"><MgscButton >join waitlist</MgscButton></Link>
                            <div className="contactAddr">
                                <a href="mailto:info@mgsc.club"><span>info@mgsc.club</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}