import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import WelcomeCard from './WelcomeCard';
import PieChart from './PieChart';
import LineChart from './LineChart';


class Portfolio extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {}

    }

    componentDidMount() { }

    render() {
        return (
            <div className="portfolio-page-section" >
                <Sidebar ownerName="" />
                <div className='portfolio-container'>
                    <div className='portfolio-section page'>
                        <WelcomeCard />
                    </div>
                    <div className='portfolio-section page'>
                        <PieChart />
                    </div>
                    <div className='portfolio-section page'>
                        <LineChart />
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



