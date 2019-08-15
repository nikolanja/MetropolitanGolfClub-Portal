import React, { Component } from 'react';
import leftArrow from '../../assets/images/left_arrow.png';
import rightArrow from '../../assets/images/right_arrow.png';
import fullScreenIcon from '../../assets/images/full_screen.png';
import exitFullScreenIcon from '../../assets/images/exit_full_screen.png';
import Dropdown from '../../components/dropdown'
import './index.scss';

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../../assets/images/MemberProspective/', false, /\.(png)$/));

var listOptions = []
images.map((image, index) => {
    listOptions.push({
        value: index,
        label: (index + 1) + '',
        isFullScreen: false
    });
    return true
})

class MemberFrame extends Component 
{

    constructor(){
        super()

        this.state = {
            img_no: 0,
            isIPhone: navigator.userAgent.match(/iPhone/i) ? true : false
            //isIPhone: true,
        }
    }

    onLeft() {
        let img_no = this.state.img_no;
        if (img_no > 0)
            this.setState({img_no: (img_no - 1)});
    }

    onRight() {
        let img_no = this.state.img_no;
        if (img_no < images.length - 1)
            this.setState({img_no: (img_no + 1)});
    }

    onPosition(val){
        this.setState({img_no: val});
    }

    onSelectPage(item){
        this.setState({img_no: item.value});
    }

    onFullScreen(){
        if(this.state.isIPhone){
            this.setState({isFullScreen: this.state.isFullScreen ? false : true})
        }else {
            if (!this.state.isFullScreen) {
                var elem = document.getElementsByClassName("member-content")[0];
                if (elem.requestFullscreen) {
                    console.log('requestFullscreen')
                    elem.requestFullscreen();
                    this.setState({isFullScreen: true});
                } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                    console.log('webkitRequestFullscreen')
                    elem.webkitRequestFullscreen();
                    this.setState({isFullScreen: true});
                } else if (elem.mozRequestFullScreen) { /* Firefox */
                    console.log('mozRequestFullScreen')
                    elem.mozRequestFullScreen();
                    this.setState({isFullScreen: true});
                } else if (elem.msRequestFullscreen) { /* IE/Edge */
                    console.log('msRequestFullscreen')
                    elem.msRequestFullscreen();
                    this.setState({isFullScreen: true});
                } else {
                    console.log('Fullscreen API is not supported.');
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen(); 
                    this.setState({isFullScreen: false});
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen(); 
                    this.setState({isFullScreen: false});
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen(); 
                    this.setState({isFullScreen: false});
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen(); 
                    this.setState({isFullScreen: false});
                } else {
                    console.log('Fullscreen API is not supported.');
                }
            }
        }
    }

    componentDidMount() {
        if(!this.state.isIPhone){
            document.addEventListener("fullscreenchange", function(event) {
                if (document.fullscreenElement === null || document.fullscreenElement === undefined) {
                    this.setState({isFullScreen: false});
                } else {
                    this.setState({isFullScreen: true});
                }
            }.bind(this));
        }
    }

    render() {
        return (
            <div className="member-content">
                <div className="gallery-panel">
                    <img className={!this.state.isIPhone && this.state.isFullScreen ? "full-image" : "general-image"} src={images[this.state.img_no]} alt="" />
                </div>
                <div className="control-panel">
                    <div className="part left"></div>
                    <div className="part center" align="center">
                        <img src={leftArrow} alt="" onClick={this.onLeft.bind(this)}/>
                        <div className="slide-label">
                            <span>Slide {this.state.img_no + 1} of {images.length}</span>
                        </div>
                        <img src={rightArrow} alt="" onClick={this.onRight.bind(this)} />
                    </div>
                    <div className="part right" align="right">
                        <div className="row-panel">
                            <Dropdown options={listOptions} selectedValue={listOptions[this.state.img_no]} changeEvent={this.onSelectPage.bind(this)}/>
                            <img src={this.state.isFullScreen ? exitFullScreenIcon : fullScreenIcon} className="fullscreen" alt="" onClick={this.onFullScreen.bind(this)}/>
                        </div>
                    </div>
                </div>
                {
                    this.state.isIPhone && this.state.isFullScreen ? (
                        <div className="iPhone-fullscreen">
                            <div className="member-content">
                                <div className="gallery-panel">
                                    <img className={this.state.isIPhone && this.state.isFullScreen ? "full-image" : "general-image"} src={images[this.state.img_no]} alt="" />
                                </div>
                                <div className="control-panel">
                                    <div className="part left"></div>
                                    <div className="part center" align="center">
                                        <img src={leftArrow} alt="" onClick={this.onLeft.bind(this)}/>
                                        <div className="slide-label">
                                            <span>Slide {this.state.img_no + 1} of {images.length}</span>
                                        </div>
                                        <img src={rightArrow} alt="" onClick={this.onRight.bind(this)} />
                                    </div>
                                    <div className="part right" align="right">
                                        <div className="row-panel">
                                            <Dropdown options={listOptions} selectedValue={listOptions[this.state.img_no]} changeEvent={this.onSelectPage.bind(this)}/>
                                            <img src={exitFullScreenIcon} className="fullscreen" alt="" onClick={this.onFullScreen.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (null)
                }
            </div>
        );
    }
}

export default MemberFrame;