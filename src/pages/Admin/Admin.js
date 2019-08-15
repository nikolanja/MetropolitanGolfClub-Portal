import React, { Component } from 'react';
import axios from 'axios';
import pageLoading from '../../assets/images/page_loading.png';
import { MgscButton } from '../../components';
import ReactDOM from 'react-dom';
import * as EmailValidator from 'email-validator';
import { database } from '../../firebase/Firebase';
import './index.scss'
import { saveAs } from 'file-saver';

class Admin extends Component 
{

    constructor(props) {
        super(props);

        this.state = {
            pageLoading: true,
            isLoading: true,
            isError: false,
            errorMsg: '',
            passcodebtndisable: false,
            invite: false, 
            resend: false
        }
    }

    componentDidMount() {
        this.userRegID = this.props.location.search.trim().replace('?', '');
        axios({
			url: 'https://us-central1-mgsc-club.cloudfunctions.net/mgscAdminCheck',
			method: 'post',
			data: {
                checkStr: this.userRegID
			}
		}).then(data => {
            if(data.data.success){
                this.setState({
                    isError: false,
                    pageLoading: false
                })
            }else {
                this.setState({
                    isError: true,
                    errorMsg: data.data.error
                });
            }
		}).catch(error => {
			this.setState({
                isError: true,
                errorMsg: error.toString()
            });
		})
    }

    getPasscode () {
        let email = ReactDOM.findDOMNode(this.refs.passcode_email).value;
        if(email.trim() === ''){
            ReactDOM.findDOMNode(this.refs.passcode_email).focus();
            return ;
        }

        if(!EmailValidator.validate(email)){
            alert('Invalid email');
            ReactDOM.findDOMNode(this.refs.passcode_email).focus();
            return ;
        }

        this.setState({passcodebtndisable: true})
        database.ref('/requestUsers').orderByChild('email').equalTo(email).once('value', function(snapshot){
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot) {
                    ReactDOM.findDOMNode(this.refs.passcode).innerHTML = childSnapshot.val().userCode
                    axios({
                        url: 'https://us-central1-mgsc-club.cloudfunctions.net/sendPasscodeMail',
                        method: 'post',
                        data: {
                            email: email
                        }
                    }).then(data => {
                        if(data.data.success){
                            
                        }else {
                            
                        }
                        this.setState({passcodebtndisable: false})
                    }).catch(error => {
                        this.setState({passcodebtndisable: false})
                    })
                    return ;
                }.bind(this))
            }else {
                alert('no such user');
                this.setState({passcodebtndisable: false})
                return ;
            }
        }.bind(this));
    }

    invite() {
        let email = ReactDOM.findDOMNode(this.refs.invite_email).value;
        if(email.trim() === ''){
            ReactDOM.findDOMNode(this.refs.invite_email).focus();
            return ;
        }

        if(!EmailValidator.validate(email)){
            alert('Invalid email');
            ReactDOM.findDOMNode(this.refs.invite_email).focus();
            return ;
        }

        this.setState({invite: true})
        database.ref().child('requestUsers').orderByChild("email").equalTo(email).once("value", (snapshot) => {
            if(snapshot.exists()){
                ReactDOM.findDOMNode(this.refs.invite_res_success).classList.add('hide');
                ReactDOM.findDOMNode(this.refs.invite_res_fail).classList.remove('hide');
                ReactDOM.findDOMNode(this.refs.invite_res_fail).innerHTML = 'This email address is already exist.';
                this.setState({invite: false})
                return ;
            }

            let id = database.ref().child("/requestUsers").push().key;
            database.ref("/requestUsers/" + id).set({
                email: email,
                userID: id
            }, function (error){
                if (error) {
                    ReactDOM.findDOMNode(this.refs.invite_res_success).classList.add('hide');
                    ReactDOM.findDOMNode(this.refs.invite_res_fail).classList.remove('hide');
                    ReactDOM.findDOMNode(this.refs.invite_res_fail).innerHTML = error.toString();
                } else {
                    ReactDOM.findDOMNode(this.refs.invite_res_success).classList.remove('hide');
                    ReactDOM.findDOMNode(this.refs.invite_res_fail).classList.add('hide');
                }
                this.setState({invite: false})
            }.bind(this));
        })
    }

    resendInvite() {
        let email = ReactDOM.findDOMNode(this.refs.send_invite_email).value;
        if(email.trim() === ''){
            ReactDOM.findDOMNode(this.refs.send_invite_email).focus();
            return ;
        }

        if(!EmailValidator.validate(email)){
            alert('Invalid email');
            ReactDOM.findDOMNode(this.refs.send_invite_email).focus();
            return ;
        }

        this.setState({resend: true})
        database.ref().child('requestUsers').orderByChild("email").equalTo(email).once("value", (snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach((snap)=>{
                    snap.ref.remove(function (error){
                        if(error){
                            ReactDOM.findDOMNode(this.refs.send_invite_res_success).classList.add('hide');
                            ReactDOM.findDOMNode(this.refs.send_invite_res_fail).classList.remove('hide');
                            ReactDOM.findDOMNode(this.refs.send_invite_res_fail).innerHTML = error.toString();
                        }else {
                            let id = database.ref().child("/requestUsers").push().key;
                            database.ref("/requestUsers/" + id).set({
                                email: email,
                                userID: id
                            }, function (error){
                                if (error) {
                                    ReactDOM.findDOMNode(this.refs.send_invite_res_success).classList.add('hide');
                                    ReactDOM.findDOMNode(this.refs.send_invite_res_fail).classList.remove('hide');
                                    ReactDOM.findDOMNode(this.refs.send_invite_res_fail).innerHTML = error.toString();
                                } else {
                                    ReactDOM.findDOMNode(this.refs.send_invite_res_success).classList.remove('hide');
                                    ReactDOM.findDOMNode(this.refs.send_invite_res_fail).classList.add('hide');
                                }
                                this.setState({resend: false})
                            }.bind(this));
                        }
                    }.bind(this));
                })
            }else {
                ReactDOM.findDOMNode(this.refs.send_invite_res_success).classList.add('hide');
                ReactDOM.findDOMNode(this.refs.send_invite_res_fail).classList.remove('hide');
                ReactDOM.findDOMNode(this.refs.send_invite_res_fail).innerHTML = 'There is no user.';
                this.setState({resend: false})
            }
        })
    }

    downloadDatabase() {
        axios({
			url: 'https://us-central1-mgsc-club.cloudfunctions.net/downloadDatabase',
			method: 'post',
			data: {
                token: this.userRegID
            },
            responseType: 'blob'
		}).then(response => {
            console.log(response.data)
            let filename = 'mgsc_database' + (new Date().getTime()) + '.xlsx';
            //const FileSaver = require('FileSaver');
            saveAs(response.data, filename);

            // const FileDownload = require('js-file-download');
            // FileDownload(response.data, 'mgsc_database' + (new Date().getTime()) + '.xlsx');
		}).catch(error => {
			alert(error.toString());
        })

        // axios({
        //     url: 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true',
        //     method: 'get',
        // }).then(response => {
        //     console.log(response);
        // })
    }

    render() {
        if(this.state.isError){
            return (
                <div className="error" align="center">
                    <span>{this.state.errorMsg}</span>
                </div>
            )
        }

        if(this.state.pageLoading){
            return (
                <div className="page-loading" align="center">
                    <img src={pageLoading} alt="" />
                </div>
            )
        }

        return (
            <div className="admin" align="center">
                <div className="main-content">
                    <div className="passcode-panel">
                        <span className="title">***  Get Passcode  ***</span>
                        <div className="input" align="left">
                            <span>Email:</span>
                            <input tpye="text" className="" name="email" ref="passcode_email"/>
                        </div>
                        <div className="passcode">
                            <span ref="passcode"></span>
                        </div>
                        <div className="actions">
                            <MgscButton onClick={this.getPasscode.bind(this)} disabled={this.state.passcode}>Get Passcode</MgscButton>
                        </div>
                    </div>

                    <div className="invite-panel">
                        <span className="title">***  Invite  ***</span>
                        <div className="input" align="left">
                            <span>Email:</span>
                            <input tpye="text" className="" name="email" ref="invite_email"/>
                        </div>
                        <div className="invite_res">
                            <span ref="invite_res_success" className="invite_res_success hide">Invited Successfully</span>
                            <span ref="invite_res_fail" className="invite_res_fail hide"></span>
                        </div>
                        <div className="actions">
                            <MgscButton onClick={this.invite.bind(this)} disabled={this.state.invite}>Invite</MgscButton>
                        </div>
                    </div>

                    <div className="invite-panel">
                        <span className="title">***  Resend Invite (mail)  ***</span>
                        <div className="input" align="left">
                            <span>Email:</span>
                            <input tpye="text" className="" name="email" ref="send_invite_email"/>
                        </div>
                        <div className="invite_res">
                            <span ref="send_invite_res_success" className="invite_res_success hide">Send Invited Successfully</span>
                            <span ref="send_invite_res_fail" className="invite_res_fail hide"></span>
                        </div>
                        <div className="actions">
                            <MgscButton onClick={this.resendInvite.bind(this)} disabled={this.state.resend}>Invite</MgscButton>
                        </div>
                    </div>

                    <div className="invite-panel">
                        <span className="title">***  Download database to Excel  ***</span>
                        <div className="actions">
                            <MgscButton onClick={this.downloadDatabase.bind(this)}>Download</MgscButton>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Admin;