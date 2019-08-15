import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { Redirect } from 'react-router-dom';
import { Background, } from '../../components';
import VideoFrame from '../VideoFrame/VideoFrame';
import MemberFrame from '../MemberFrame/MemberFrame';
import GolfClubFrame from '../GolfClubFrame/GolfClubFrame';
import btnClose from '../../assets/images/IconsClose.png';
import pageLoading from '../../assets/images/page_loading.png';
import GolfTierItem from './GolfTierItem';
import subscriptions from './subscription';
import './index.scss';

import { database } from '../../firebase/Firebase';
import PhoneVerification from '../PhoneVerification/PhoneVerification'

import $ from 'jquery'; 

import Cookies from 'universal-cookie';
const cookies = new Cookies();

function setContentHeight(){
    let hei = $(window).height();
    if(hei > $('#root').height()){
        $('.mgsc-back').css('height', hei + 'px');
        //$('.join-frame').css('padding-top', (hei - $('.main-content').height()) / 2 + 'px')
    }else {
        $('.mgsc-back').css('height', '');
        //$('.join-frame').css('padding-top', '');
    }
}

class Home extends Component 
{

    constructor(props){
        super(props);

        this.state={
            page_num: 0,
            choose_modal: false,
            is_submitted: false,
            page_loading: true,
            redirectSign: (this.props.location.search === '' || this.props.location.search === '?') ? true : false,
            redirectSignApplication: false,
            phoneVerification: false,
            signupUser: null
        }

        this.onOpenChooseModal = this.onOpenChooseModal.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
    }

    componentDidUpdate() {
        setContentHeight();
    }

    componentDidMount() {
        $(window).resize(function(){
            setContentHeight();
        });
        setContentHeight();

        this.userRegID = this.props.location.search.trim().replace('?', '');
        database.ref('/users').orderByChild('userRegID').equalTo(this.userRegID).once('value', function(snapshot){
            
            if(snapshot.exists()){
                snapshot.forEach(function(childSnapshot) {
                    if(cookies.get('mgsc_user') === undefined || cookies.get('mgsc_user').search(this.userRegID) < 0){
                        // go to phone verification page
                        this.setState({
                            phoneVerification: true,
                            signupUser: childSnapshot.val(),
                        })
                    }else {
                        this.setState({
                            page_loading: false,
                            phoneVerification: false,
                            signupUser: childSnapshot.val()
                        })
                    }
                }.bind(this));
            }else {
                this.setState({redirectSignApplication: true});
            }
        }.bind(this))
    }

    componentWillMount() {
		ReactModal.setAppElement('body');
	}

    onClickNav(nav){
        this.setState({page_num: nav});
    }

    onCloseModal() {
	    this.setState({ choose_modal: false });
    };
    
    onOpenChooseModal() {
	    this.setState({ choose_modal: true });
    };

    notifyAlert(no){
        if(window.confirm("By clicking \"Ok\" you agree to submit your application and will not be able to go back.")){
            database.ref('/users').orderByChild('userRegID').equalTo(this.userRegID).once('value', function(snapshot){
                if(snapshot.exists()){
                    snapshot.forEach(function(childSnapshot) {
                        let key = childSnapshot.key;
                        let updates = {
                            membership: {
                                title: subscriptions[no].title,
                                price: subscriptions[no].price
                            }
                        }
                        database.ref("/users/" + key).update(updates);
                        window.location.href = "/membership";
                    })
                }
            });
        }
    }

    phoneverification() {
        var expiredate = new Date();
        expiredate.setTime(expiredate.getTime() + (24 * 60 * 60 * 1000));
        cookies.set('mgsc_user', "lwkejflwwehfkaj" + this.state.signupUser.userRegID + "cawohcawf2u29wc", {path: '/', expires: expiredate})
        this.setState({
            page_loading: false,
            phoneVerification: false
        });
    }

    render() {
        if (this.state.phoneVerification){
            return (
                <PhoneVerification 
                    userid={this.userRegID}
                    pv_callback={this.phoneverification.bind(this)} />
            )
        }
        
        if(this.state.redirectSignApplication){
            return (
                <Redirect to={"/signup-application" + this.props.location.search} />
            );
        }

        if(this.state.redirectSign){
            return (
                <Redirect to="/" />
            );
        }
        
        if(this.state.page_loading){
            return (
                <div className="page-loading" align="center">
                    <Background/>
                    <img src={pageLoading} alt="" />
                </div>
            )
        }

        return (
            <div className="home">
                {
                    this.state.page_num !== 2 ? (<Background blur/>) : (<Background/>)
                }
                <div className="main-content" ref="main_content" align="center">
                    <div className="header">
                        <div className="nav">
                            <div className={this.state.page_num === 0 ? "nav-item active" : "nav-item"} onClick={this.onClickNav.bind(this, 0)}>
                                <span>video</span>
                            </div>
                            <div className={this.state.page_num === 1 ? "nav-item active" : "nav-item"} onClick={this.onClickNav.bind(this, 1)}>
                                <span>member prospectus</span>
                            </div>
                            <div className={this.state.page_num === 2 ? "nav-item active" : "nav-item"} onClick={this.onClickNav.bind(this, 2)}>
                                <span>golf club prospects</span>
                            </div>
                        </div>
                        <div className="nav-action">
                            <button className="btn-home-cat" onClick={this.onOpenChooseModal}>choose waitlist to join</button>
                        </div>
                    </div>

                    <div className="nav-content" align="center">
                        <div className={this.state.page_num === 0 ? 'video-frame' : 'hide'}>
                            <VideoFrame />
                        </div>
                        <div className={this.state.page_num === 1 ? 'member-frame' : 'hide'}>
                            <MemberFrame />
                        </div>
                        <div className={this.state.page_num === 2 ? 'golf-club-frame' : 'hide'}>
                            <GolfClubFrame />
                        </div>
                    </div>
                </div>

                <ReactModal isOpen={this.state.choose_modal} contentLabel="" onRequestClose={this.onCloseModal}
                    style={{
                        overlay: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(243, 236, 223, 0.5)'
                        },
                        content: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            padding: 0,
                            background: "rgba(0,0,0,0.8)",
                            border: 0
                        }}}>
                    
                    <div className="modal-container" align="center">
                        <div className="close-action">
                            <div className="btn-close" align="right">
                                <img src={btnClose} onClick={this.onCloseModal} alt="" />
                            </div>
                        </div>

                        <div className="main-container">
                            
                            <div className="modal-title">
                                <span className="line1">Please select one waitlist to join</span>
                                <div className="line2"><span className="line2">Limited availability per tier</span></div>
                            </div>

                            <div className="items">
                                <GolfTierItem data={subscriptions[0]} onApply={this.notifyAlert.bind(this, 0)}/>
                                <GolfTierItem data={subscriptions[1]} onApply={this.notifyAlert.bind(this, 1)}/>
                                <GolfTierItem data={subscriptions[2]} onApply={this.notifyAlert.bind(this, 2)}/>
                                <GolfTierItem data={subscriptions[3]} onApply={this.notifyAlert.bind(this, 3)}/>
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>
        );
    }
}

export default Home;