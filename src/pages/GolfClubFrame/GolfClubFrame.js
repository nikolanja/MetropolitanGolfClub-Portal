import React, { Component } from 'react';
import './index.scss';
import clubs from '../../data/data';

const tiers = ["tier 1", "tier 2"];

const cities = ["New York", "New Jersey", "Connecticut"];

class GolfClubFrame extends Component {

    constructor() {
        super()

        this.state = {
            tier: 0,
            city: 0
        }
    }

    onChangeTier(t) {
        this.setState({tier: t})
    }

    onChangeCity(c) {
        this.setState({city: c})
    }

    render() {
        var showClubs = [];
        clubs.forEach(element => {
            if(element.state === cities[this.state.city] && (element.tier - 1) === this.state.tier){
                showClubs.push(element);
            }
        });

        showClubs.sort((a, b) => {
            return a.club > b.club ? 1 : -1
        });

        return (
            <div className="golf-club-content">
                <div className="filter-panel">
                    <div className="title" align="left">
                        <span>filters</span>
                    </div>

                    <div className="tiers">
                    {
                        tiers.map((tier, index) => {
                            return (
                                <div className="tier" key={index}>
                                    <button className={this.state.tier === index ? "btn-filter tier" : "btn-filter deactive tier"} onClick={this.onChangeTier.bind(this, index)}>{tier}</button>
                                </div>
                            )
                        })
                    }
                    </div>

                    <div className="cities">
                    {
                        cities.map((city, index) => {
                            return (
                                <div className='city' key={index}>
                                    <button className={this.state.city === index ? "btn-filter" : "btn-filter deactive"} onClick={this.onChangeCity.bind(this, index)}>{city}</button>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>

                <div className="club-panel" align="left">
                    <div className="title" align="left"><span>Country Clubs</span></div>

                    <div className="clubs">
                    {
                        showClubs.map((item, index) => {
                            return (
                                <div className="club" align="left" key={index}><span>{item.club}</span></div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        );
    }
}

export default GolfClubFrame;