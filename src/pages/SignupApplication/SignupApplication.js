import React, { Component } from 'react';
import Select, { components } from 'react-select';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import * as EmailValidator from 'email-validator';
import { Background, MgscButton } from '../../components';
import logo from '../../assets/images/signup_logo.png';
import btnClose from '../../assets/images/IconsClose.png';
import IconsBack from '../../assets/images/IconsBack.png';
import pInfo from '../../assets/images/pinfo.png';
import lInfo from '../../assets/images/liveinfo.png';
import loading from '../../assets/images/loading.gif';
import { database } from '../../firebase/Firebase';
import pageLoading from '../../assets/images/page_loading.png';
import { Redirect } from 'react-router-dom';
import {neighborOptions, citiesOptions, stateOptions} from '../../data/data';
import './index.scss';
import PhoneVerification from '../PhoneVerification/PhoneVerification'

import Cookies from 'universal-cookie';
 
const cookies = new Cookies();

const emptyCityOptions = [
    
];

const Placeholder = props => {
    return <components.Placeholder {...props} />;
};

const selectCustomStyle = {
    placeholder: base => ({
        ...base,
        fontSize: "1em",
        color: "gray",
        fontWeight: 400
    }),
    option: (provided, state) => ({
        ...provided,
        borderRadius: 0,
        borderBottom: '1px solid gray',
    }),
    control: (base, state) => ({
        ...base,
        background: "rgba(0,0,0,0)",
        height: "40px",
        color: "white"
    }),
    indicatorSeparator: (styles) => ({
        display: "none"
    }),
    menu: base => ({
        ...base,
        background: "white",
        border: "2px solid white",
        color: "black"
    })
};

class SignupApplication extends Component 
{

    constructor(){
        super()
        this.state = {
            fullname: '',
            email: '',
            age: '',
            occupation: '',
            linkedin: '',
            oldClub: '',
            where_do_you_live: false,
            work_from_home: true,
            liveState: '',
            liveCity: '',
            liveNeighborShow: false,
            liveNeighbor: '',
            isWorkHome: true,
            workState: '',
            workCity: '',
            workNeighborShow: false,
            workNeighbor: '',
            isError: true,
            errorMsg: '',
            isLoading: false,
            isLiveError: true,
            errorLiveMsg: '',
            page_loading: true,
            signupUser: null,
            phoneVerification: false,
            redirectSign: false,
            selectedCityOptions: emptyCityOptions,
            selectedWorkCityOptions: emptyCityOptions,
            submitClicked: false
        }
    }

    componentDidMount() {
        //ReactDOM.findDOMNode(this.refs.main_content).current.scrollTo(0,0);

        this.userRegID = this.props.location.search.trim().replace('?', '');
        database.ref('/requestUsers/' + this.userRegID).once('value', function(snapshot){
            if(snapshot.exists()){
                let data = snapshot.val()
                if(cookies.get('mgsc_user') === undefined || cookies.get('mgsc_user').search(data.userID) < 0){
                    // go to phone verification page
                    this.setState({
                        signupUser: data,
                        fullname: data.fullName === undefined ? '' : data.fullName,
                        email: data.email,
                        age: data.age === undefined ? '' : data.age,
                        occupation: '',
                        linkedin: data.linkedinUrl === undefined ? '' : data.linkedinUrl,
                        oldClub: data.oldClub === undefined ? '' : data.oldClub,
                        phoneVerification: true
                    })
                }else {
                    this.setState({
                        signupUser: snapshot.val(),
                        fullname: data.fullName === undefined ? '' : data.fullName,
                        email: data.email,
                        age: data.age === undefined ? '' : data.age,
                        occupation: '',
                        linkedin: data.linkedinUrl === undefined ? '' : data.linkedinUrl,
                        oldClub: data.oldClub === undefined ? '' : data.oldClub,
                        phoneVerification: false,
                        page_loading: false
                    })
                }
            } else {
                this.setState({redirectSign: true});
            }
        }.bind(this))
    }

    onPageChange(where){
        if (!EmailValidator.validate(ReactDOM.findDOMNode(this.refs.email).value)){
            this.setState({
                isError: true,
                errorMsg: "Invalid Email Address."
            });
            ReactDOM.findDOMNode(this.refs.email).focus();
            return ;
        }

        ReactDOM.findDOMNode(this.refs.error).classList.add("hide");
        this.setState({where_do_you_live: where});
        window.scrollTo(0,0);
    }

    keyPress(e) {
        let vk_tab = 9;
        if((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode === vk_tab){
            
        }else {
            e.preventDefault();
        }
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleLiveStateChange = (selectedOption) => {
        this.setState({
            liveState: selectedOption.value,
            selectedCityOptions: citiesOptions[selectedOption.value]
        });
    }

    handleLiveCityChange = (selectedOption) => {
        if (selectedOption.value === 'Manhattan'){
            this.setState({
                liveCity: selectedOption.value,
                liveNeighborShow: true
            });
        }else {
            this.setState({
                liveCity: selectedOption.value,
                liveNeighborShow: false,
            });
        }
    }

    handleLiveNeighborChange = (selectedOption) => {
        this.setState({liveNeighbor: selectedOption.value});
    }

    workHomeCheck(isWorkHome) {
        this.setState({isWorkHome: isWorkHome});
        if(isWorkHome){
           this.setState({
               workState: '',
               workCity: '',
               workNeighbor: ''
           })
        }
    }

    handleWorkStateChange = (selectedOption) => {
        this.setState({
            workState: selectedOption.value,
            selectedWorkCityOptions: citiesOptions[selectedOption.value]
        });
    }

    handleWorkCityChange = (selectedOption) => {
        if (selectedOption.value === 'Manhattan'){
            this.setState({
                workCity: selectedOption.value,
                workNeighborShow: true,
            });
        } else {
            this.setState({
                workCity: selectedOption.value,
                workNeighborShow: false,
            });
        }
    }

    handleWorkNeighborChange = (selectedOption) => {
        this.setState({workNeighbor: selectedOption.value});
    }

    onSubmit() {
        this.setState({
            isLoading: true,
            submitClicked: true
        })

        // for testing
        let id = database.ref().child("/users").push().key;

        // for real id
        /*           */
        ////////

        let updates = {
            fullName: this.state.fullname,
            email: this.state.email,
            age: this.state.age,
            linkedinUrl: this.state.linkedin,
            oldClub: this.state.oldClub,
            occupation: this.state.occupation,
            liveState: this.state.liveState,
            liveCity: this.state.liveCity,
            liveNeighbor: this.state.liveNeighbor,
            userRegID: this.state.signupUser.userID
        }

        if (this.state.isWorkHome === false){
            updates.workState = this.state.workState;
            updates.workCity = this.state.workCity;
            updates.workNeighbor = this.state.workNeighbor;
        }

        database.ref("/users/" + id).set(updates, function (error){
            if (error) {
                this.setState({
                    isLoading: false,
                    isError: true,
                    submitClicked: false,
                    errorMsg: 'Submission is failed.'
                });
                console.log(error);
            } else {
                window.location.href="/home?" + this.state.signupUser.userID;
            }
        }.bind(this));

        let reqUpdates = {
            fullName: this.state.fullname,
            email: this.state.email,
            age: this.state.age,
            linkedinUrl: this.state.linkedin,
            oldClub: this.state.oldClub,
        }
        database.ref("/requestUsers/" + this.userRegID).update(reqUpdates);
    }

    phoneverification(res) {
        var expiredate = new Date();
        expiredate.setTime(expiredate.getTime() + (24 * 60 * 60 * 1000));
        cookies.set('mgsc_user', "lwkejflwwehfkaj" + this.state.signupUser.userID + "cawohcawf2u29wc", {expires: expiredate})
        this.setState({
            page_loading: false,
            phoneVerification: false
        });
    }

    handleChangeAge(evt){
        const age = (evt.target.validity.valid) ? evt.target.value : this.state.age;
    
        this.setState({ age });
    }

    render() {
        if (this.state.phoneVerification){
            return this.state.signupUser.fullName === undefined ? (
                <PhoneVerification 
                    isInvite
                    userid={this.userRegID}
                    pv_callback={this.phoneverification.bind(this)} />
            ) : (
                <PhoneVerification 
                    userid={this.userRegID}
                    pv_callback={this.phoneverification.bind(this)} />
            )
        }

        if (this.state.redirectSign){
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
            <div className="signup-app">
                <Background blur signup/>
                <div className="main-content" align="center" ref="main_content">
                    {
                        this.state.where_do_you_live ? (
                            <div className="btn-back">
                                <img src={IconsBack} onClick={this.onPageChange.bind(this, false)} alt=""/>
                            </div>
                        ) : null
                    }
                    <div className="btn-close">
                        <Link to="/"><img src={btnClose} alt=""/></Link>
                    </div>
                    <img src={logo} className="signup-logo" alt=""/>
                    <div className="user-form">
                        <span className="form-title">prospective membership application</span>
                        <div className={this.state.where_do_you_live ? 'form-content' : 'hide form-content'}>
                            <div className="label">
                                <span>where do you live?</span>
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">select a state</label>
                                <Select
                                    closeMenuOnSelect={true}
                                    onChange={this.handleLiveStateChange}
                                    components={{ Placeholder }}
                                    placeholder={"Select your state"}
                                    styles={selectCustomStyle}
                                    options={stateOptions}
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                            ...theme.colors,
                                            primary25: "#93a7ff",
                                            primary: "#576cc7",
                                            neutral80: "white"
                                        }
                                    })}
                                />
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">city / town / borough</label>
                                <Select
                                    closeMenuOnSelect={true}
                                    onChange={this.handleLiveCityChange}
                                    components={{ Placeholder }}
                                    placeholder={"Select your city"}
                                    styles={selectCustomStyle}
                                    options={this.state.selectedCityOptions}
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 0,
                                        colors: {
                                            ...theme.colors,
                                            primary25: "#93a7ff",
                                            primary: "#576cc7",
                                            neutral80: "white"
                                        }
                                    })}
                                />
                            </div>

                            {
                                this.state.liveNeighborShow ? (
                                    <div className="form-item" align="left">
                                        <label className="form-label">neighborhood</label>
                                        <Select
                                            closeMenuOnSelect={true}
                                            onChange={this.handleLiveNeighborChange}
                                            components={{ Placeholder }}
                                            placeholder={"Select your neighborhood"}
                                            styles={selectCustomStyle}
                                            options={neighborOptions}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#93a7ff",
                                                    primary: "#576cc7",
                                                    neutral80: "white"
                                                }
                                            })}
                                        />
                                    </div>
                                ) : (null)
                            }

                            <div className="label">
                                <span>Where is your work office?</span>
                                <div className="buttons" align="center">
                                    {
                                        this.state.isWorkHome ? (
                                            <button className="wherework">Work from home</button>
                                        ) : (
                                            <button className="wherework deactive" onClick={this.workHomeCheck.bind(this, true)}>Work from home</button>
                                        )
                                    }

                                    {
                                        this.state.isWorkHome ? (
                                            <button className="wherework deactive" onClick={this.workHomeCheck.bind(this, false)}>Other</button>
                                        ) : (
                                            <button className="wherework">Other</button>
                                        )
                                    }
                                </div>
                            </div>

                            {
                                this.state.isWorkHome ? (null) : (
                                    <div className="work-office-frame">
                                        <div className="form-item" align="left">
                                            <label className="form-label">select a state</label>
                                            <Select
                                                closeMenuOnSelect={true}
                                                onChange={this.handleWorkStateChange}
                                                components={{ Placeholder }}
                                                placeholder={"Select your state"}
                                                styles={selectCustomStyle}
                                                options={stateOptions}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#93a7ff",
                                                        primary: "#576cc7",
                                                        neutral80: "white"
                                                    }
                                                })}
                                            />
                                        </div>

                                        <div className="form-item" align="left">
                                            <label className="form-label">city / town / borough</label>
                                            <Select
                                                closeMenuOnSelect={true}
                                                onChange={this.handleWorkCityChange}
                                                components={{ Placeholder }}
                                                placeholder={"Select your city"}
                                                styles={selectCustomStyle}
                                                options={this.state.selectedWorkCityOptions}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#93a7ff",
                                                        primary: "#576cc7",
                                                        neutral80: "white"
                                                    }
                                                })}
                                            />
                                        </div>

                                        {
                                            this.state.workNeighborShow ? (
                                                <div className="form-item" align="left">
                                                    <label className="form-label">neighborhood</label>
                                                    <Select
                                                        closeMenuOnSelect={true}
                                                        onChange={this.handleWorkNeighborChange}
                                                        components={{ Placeholder }}
                                                        placeholder={"Select your neighborhood"}
                                                        styles={selectCustomStyle}
                                                        options={neighborOptions}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            borderRadius: 0,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25: "#93a7ff",
                                                                primary: "#576cc7",
                                                                neutral80: "white"
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            ) : (null)
                                        }
                                    </div>
                                )
                            }

                            <div className="form-item error" align="left">
                                <span className={this.state.isLiveError ? '' : "hide"} ref="error">{this.state.errorLiveMsg}</span>
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
                                ((this.state.liveState === '' || this.state.liveCity === '') || this.state.submitClicked ||
                                    (!this.state.isWorkHome && (this.state.workState === '' || this.state.workCity === ''))) ? (
                                    <MgscButton onClick={this.onSubmit.bind(this)} disabled>submit</MgscButton>
                                ) : (
                                    <MgscButton onClick={this.onSubmit.bind(this)}>submit</MgscButton>
                                )
                            }
                            </div>

                            <div className="carousel">
                                <img src={pInfo} alt=""/>
                            </div>
                        </div>


                        <div className={this.state.where_do_you_live ? 'hide form-content' : 'form-content'}>
                            <div className="form-item" align="left">
                                <label className="form-label">full name</label>
                                <input type="text" className="form-input" name="fullname" onChange={this.handleChange.bind(this)} defaultValue={this.state.signupUser.fullName}/>
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">email address</label>
                                <input type="email" readOnly className="form-input" name="email" ref="email" onChange={this.handleChange.bind(this)} defaultValue={this.state.signupUser.email}/>
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">age</label>
                                {/* <input type="text" className="form-input" name="age" ref="age" defaultValue={this.state.signupUser.age}
                                    onChange={this.handleChange.bind(this)} onKeyDown={this.keyPress.bind(this)}/> */}
                                <input type="text" className="form-input" pattern="[0-9]*" onInput={this.handleChangeAge.bind(this)} onChange={this.handleChange.bind(this)} value={this.state.age} defaultValue={this.state.signupUser.age}/>
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">occupation</label>
                                <input type="text" className="form-input" name="occupation" onChange={this.handleChange.bind(this)}/>
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">linkedin profile url</label>
                                <input type="text" className="form-input" name="linkedin" onChange={this.handleChange.bind(this)} defaultValue={this.state.signupUser.linkedinUrl}/>
                            </div>

                            <div className="form-item" align="left">
                                <label className="form-label">prior or current country club</label>
                                <input type="text" className="form-input" name="oldClub" onChange={this.handleChange.bind(this)} defaultValue={this.state.signupUser.oldClub}/>
                            </div>

                            <div className="form-item error" align="left">
                                <span className={this.state.isError ? '' : "hide"} ref="error">{this.state.errorMsg}</span>
                            </div>

                            <div className="form-action">
                            {
                                (this.state.fullname === '' || this.state.email === '' || this.state.age === '' || this.state.occupation === '' || this.state.linkedin === '' || this.state.oldClub === '') ? (
                                    <MgscButton onClick={this.onPageChange.bind(this, true)} disabled>next</MgscButton>
                                ) : (
                                <MgscButton onClick={this.onPageChange.bind(this, true)}>next</MgscButton>
                                )
                            }
                            </div>

                            <div className="carousel">
                                <img src={lInfo} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignupApplication;