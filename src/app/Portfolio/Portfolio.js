import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import WelcomeCard from './WelcomeCard';


ChartJS.register(ArcElement, Tooltip, Legend);

class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }
    

    componentDidMount() { }
    

    render() {

        const data = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
              {
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          };
          
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
                            <Doughnut data={data} />
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



