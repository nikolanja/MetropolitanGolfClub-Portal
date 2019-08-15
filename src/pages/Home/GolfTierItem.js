import React, { Component } from 'react';
import checkIcon from '../../assets/images/check.png';
import uncheckIcon from '../../assets/images/uncheck.png';

export default class GolfTierItem extends Component
{

    render() {
        return (
            <div className="item">
                <div className="item-content">
                    <div className="title"><span>{this.props.data.title}</span></div>
                    <div className="categories">
                        <div className="category" align="left">
                            <img src={this.props.data.tier1_golf_course ? checkIcon : uncheckIcon} alt=""/>
                            <div className={this.props.data.tier1_golf_course ? "desc check" : "desc uncheck"}><span>Tier 1 Golf Courses</span></div>
                        </div>
                        <div className="line" />
                        <div className="category" align="left">
                            <img src={this.props.data.tier2_golf_course ? checkIcon : uncheckIcon} alt=""/>
                            <div className={this.props.data.tier2_golf_course ? "desc check" : "desc uncheck"}><span>Tier 2 Golf Courses</span></div>
                        </div>
                        <div className="line" />
                        <div className="category" align="left">
                            <img src={this.props.data.clubhouse_membership ? checkIcon : uncheckIcon} alt=""/>
                            <div className={this.props.data.clubhouse_membership ? "desc check" : "desc uncheck"}><span>Clubhouse membership</span></div>
                        </div>
                        <div className="line" />
                        <div className="category last" align="left">
                            <img src={this.props.data.social_club_reciprocals ? checkIcon : uncheckIcon} alt=""/>
                            <div className={this.props.data.social_club_reciprocals ? "desc check" : "desc uncheck"}><span>Social Club Reciprocals</span></div>
                        </div>
                    </div>

                    <div className="subscription" align="center">
                        <span className="price">{this.props.data.price}</span>
                        <div className="desc"><span>annual dues</span></div>
                    </div>

                    <div className="action">
                        <button type="button" className="btn-home-cat" onClick={this.props.onApply}>Apply</button>
                    </div>
                </div>
            </div>
        )
    }
}