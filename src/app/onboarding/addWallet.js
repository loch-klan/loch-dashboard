import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import deleteicon from "../../image/Vector-delete.svg";
import plusicon from "../../image/Vector-plus.svg";
import infoicon from "../../image/Vector-info.svg";

class AddWallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
        }
        // this.onClose = this.onClose.bind(this);   
    }

    componentDidMount() { }

    render() {
        return (
            <>
                <div className='ob-modal-body-1'>
                    <img className='ob-modal-body-del' src={deleteicon} />
                    <input className='inter-display-regular f-s-16 lh-20 ob-modal-body-text' placeholder='Paste your wallet address here' />
                </div>
                <div className='ob-modal-body-2'>
                    <Button className="ob-modal-body-add-btn inter-display-medium">
                        <img src={plusicon} /> Add another
                    </Button>
                </div>
                <div className='ob-modal-body-btn'>
                    <Button className="inter-display-semi-bold f-s-16 lh-20 ob-modal-body-secondary-btn">
                        Preview demo instead
                    </Button>
                    <Button className="inter-display-semi-bold f-s-16 lh-20 black-btn ob-modal-body-black-btn" >
                        Go
                    </Button>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => ({
    // homeState: state.HomeState
});
const mapDispatchToProps = {
    // getPosts: fetchPosts
}
AddWallet.propTypes = {
    // getPosts: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);