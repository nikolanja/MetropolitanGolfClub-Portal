import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import ReactDOM from 'react-dom';
import { Background, MgscButton } from '../../components';
import logo from '../../assets/images/signup_logo.png';
import btnClose from '../../assets/images/IconsClose.png';
import { database } from '../../firebase/Firebase';
import loading from '../../assets/images/loading.gif';
import './index.scss';

import $ from 'jquery'; 

const backInterval = 4000;

class Signup extends Component 
{

    constructor(){
        super()
        this.state = {
            fullname: '',
            email: '',
            age: '',
            linkedin: '',
            oldClub: '',
            submitted: false,
            isLoading: false,
            isError: false,
            errorMsg: ''
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

    componentDidMount(){
        $(window).resize(function(){
            this.setContentHeight();
        }.bind(this));
        this.setContentHeight();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChangeAge(evt){
        const age = (evt.target.validity.valid) ? evt.target.value : this.state.age;
    
        this.setState({ age });
    }

    onSubmit(){
        if(this.state.isLoading){
            return ;
        }

        if(!EmailValidator.validate(this.state.email)){
            this.setState({
                isError: true,
                errorMsg: "Invalid Email Address."
            });
            ReactDOM.findDOMNode(this.refs.email).focus();
            return ;
        }else {
            ReactDOM.findDOMNode(this.refs.error).classList.add("hide");
        }

        this.setState({isLoading: true})

        database.ref().child('requestUsers').orderByChild("email").equalTo(this.state.email).once("value", (snapshot) => {
            if(snapshot.exists()){
                this.setState({
                    isLoading: false,
                    isError: true,
                    errorMsg: 'This email address is already exist.'
                });
                return ;
            }

            let id = database.ref().child("/requestUsers").push().key;
            database.ref("/requestUsers/" + id).set({
                fullName: this.state.fullname,
                email: this.state.email,
                age: this.state.age,
                linkedinUrl: this.state.linkedin,
                oldClub: this.state.oldClub,
                userID: id
            }, function (error){
                if (error) {
                    this.setState({
                        isLoading: false,
                        isError: true,
                        errorMsg: 'Submission is failed.'
                    });
                    console.log(error);
                } else {
                    this.setState({
                        submitted: true,
                        isLoading: false,
                    })
                    setInterval(() => {
                        window.location.href = '/';
                    }, backInterval)
                }
            }.bind(this));
        })
    }

    handleCountryCodeChange = (selectedOption) => {
        this.setState({countryCode: selectedOption.value});
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
                    {
                        this.state.submitted === false ? (
                            <div className="user-form">
                                <span className="form-title">enter your information</span>
                                <div className="form-content">
                                    <div className="form-item" align="left">
                                        <label className="form-label">full name</label>
                                        <input type="text" className="form-input" name="fullname" onChange={this.handleChange.bind(this)}/>
                                    </div>

                                    <div className="form-item" align="left">
                                        <label className="form-label">email address</label>
                                        <input type="email" className="form-input" ref="email" name="email" onChange={this.handleChange.bind(this)}/>
                                    </div>

                                    <div className="form-item" align="left">
                                        <label className="form-label">age</label>
                                        <input type="text" className="form-input" pattern="[0-9]*" onInput={this.handleChangeAge.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.age} />
                                    </div>

                                    <div className="form-item" align="left">
                                        <label className="form-label">linkedin profile url</label>
                                        <input type="text" className="form-input" name="linkedin" onChange={this.handleChange.bind(this)}/>
                                    </div>

                                    <div className="form-item" align="left">
                                        <label className="form-label">prior or current country club</label>
                                        <input type="text" className="form-input" name="oldClub" onChange={this.handleChange.bind(this)}/>
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
                                            (this.state.fullname === '' || this.state.email === '' || this.state.age === '' || this.state.linkedin === '' || this.state.oldClub === '') ? (
                                                <MgscButton disabled>submit</MgscButton>
                                            ) : (
                                            <MgscButton onClick={this.onSubmit.bind(this)}>submit</MgscButton>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="user-form">
                                {/* <span className="form-title">prospect membership application</span> */}

                                <div className="tky" align="center">
                                    <span className="tky">Thank you</span>
                                    <div className="tky-desc">
                                        <span>Your information has been sent successfully.</span>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default Signup;