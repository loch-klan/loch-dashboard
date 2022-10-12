import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Sidebar from '../common/Sidebar';
import IntelWelcomeCard from './IntelWelcomeCard';
import PageHeader from '../common/PageHeader';
import { TransactionHistoryPage } from './TransactionHistoryPage';
class Intelligence extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() { }

    render() {
        return (
            <div className="intelligence-page-section">
              {/* <Sidebar ownerName=""/> */}
              <div className='intelligence-section page'>
                <PageHeader
                    title="Intelligence"
                    subTitle="Automated and personalized financial intelligence"
                />
                {/* <IntelWelcomeCard /> */}
                <TransactionHistoryPage />
              </div>
            </div>
            
        )
    }
}

const mapStateToProps = state => ({
    intelligenceState: state.IntelligenceState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
Intelligence.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Intelligence);