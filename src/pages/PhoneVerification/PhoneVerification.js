import React, { Component } from 'react';
import { Background, MgscButton } from '../../components';
import logo from '../../assets/images/signup_logo.png';
import loading from '../../assets/images/loading.gif';
import axios from 'axios';
import './index.scss';

import $ from 'jquery'; 

class PhoneVerification extends Component 
{

    constructor(props){
        super(props)
        this.state = {
            verificationCode: '',
            isLoading: false,
            isError: false,
            errorMsg: '',
            page_loading: false,
            isInvite: this.props.isInvite ? true : false
        }
    }

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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount () {
        $(window).resize(function(){
            this.setContentHeight();
        }.bind(this));
        this.setContentHeight();
    }

    onSubmit(){
        this.setState({isLoading: true});
        axios({
			url: 'https://us-central1-mgsc-club.cloudfunctions.net/checkUserVerification',
			method: 'post',
			data: {
                userid: this.props.userid,
                passcode: this.state.verificationCode
			}
		}).then(data => {
            if(data.data.success){
                this.props.pv_callback();
            }else {
                this.setState({
                    isLoading: false,
                    isError: true,
                    errorMsg: data.data.error
                });
            }
		}).catch(error => {
			this.setState({
                isLoading: false,
                isError: true,
                errorMsg: error.toString()
            });
		})
    }

    render () {
        return (
            <div className="signup-app">
                <Background blur signup/>
                <div className="main-content" align="center">

                    <img src={logo} className="signup-logo" alt=""/>
                    <div className="user-form">
                        <span className="form-title">User Verification</span>

                        <div className="form-content">
                            <div className="form-item" align="left">
                                <label className="phone-verify">Enter passcode from email</label>
                                <input type="text" className="form-input" id="v_code" name='verificationCode' onChange={this.handleChange.bind(this)}/>
                            </div>

                            <div className="form-item error" align="left">
                                <span className={this.state.isError ? '' : "hide"} ref="error">{this.state.errorMsg}</span>
                            </div>
                            {
                                this.state.isLoading ? (
                                    <div className="loading-panel" align="center">
                                        <img src={loading} className="loading" alt="" />
                                    </div>
                                ) : (null)
                            }
                            <div className="form-action">
                                {
                                    this.state.verificationCode === '' ? (
                                        <MgscButton disabled>verify</MgscButton>
                                    ) : (
                                        <MgscButton onClick={this.onSubmit.bind(this)}>verify</MgscButton>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PhoneVerification;