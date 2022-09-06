import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';

import WelcomeCard from './WelcomeCard';
class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div className="portfolio-page-section">
                <Sidebar ownerName="" />
                <div className='portfolio-container'>
                    <div className='portfolio-section page'>
                        <WelcomeCard />
                    </div>
                    <div className='portfolio-section page'>
                        <div className=''>
                            <h1 className='Inter-Medium'>Overview</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    portfolioState: state.PortfolioState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
Portfolio.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);



