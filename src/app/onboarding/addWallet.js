import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import DeleteIcon from "../../assets/images/icons/delete-icon.svg";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import CustomButton from "../../utils/form/CustomButton";
import Form from "../../utils/form/Form";
import { Col, Container, Row } from 'react-bootstrap';
import { getAllCoins, detectCoin } from "./Api";
import CustomChip from "../../utils/commonComponent/CustomChip";

class AddWallet extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            addButtonVisible: false,
            walletInput: [{ id: "wallet1", address: "" }]
        }
        this.timeout = 0
    }


    componentDidMount() {
        this.props.getAllCoins()
    }

    handleOnChange = (e) => {
        let { name, value } = e.target;
        let walletCopy = [...this.state.walletInput];
        let foundIndex = walletCopy.findIndex(obj => obj.id === name);
        if (foundIndex > -1) {
            walletCopy[foundIndex].address = value
        }
        this.setState({
            addButtonVisible: this.state.walletInput[0].address,
            walletInput: walletCopy
        });
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnWalletAddress(name, value);
        }, 300)
    }

    getCoinBasedOnWalletAddress = (name, value) => {
        if (this.props.OnboardingState.coinsList && value) {
            for (let i = 0; i < this.props.OnboardingState.coinsList.length; i++) {
                this.props.detectCoin({
                    id: name,
                    coinCode: this.props.OnboardingState.coinsList[i].code,
                    coinSymbol: this.props.OnboardingState.coinsList[i].symbol,
                    coinName: this.props.OnboardingState.coinsList[i].name,
                    address: value
                })
            }
        }
    }

    addInputField = () => {
        this.state.walletInput.push({
            id: `wallet${this.state.walletInput.length + 1}`,
            address: ""
        })
        this.setState({
            walletInput: this.state.walletInput
        });
    }

    deleteInputField = (index) => {
        delete this.state.walletInput[index - 1];
        this.setState({
            walletInput: this.state.walletInput
        });

    }

    render() {
        console.log(this.props.OnboardingState)
        return (
            <>
                <Form onValidSubmit={this.onValidSubmit}>
                    <Container>
                        <Row className="ob-modal-body-1">
                            {this.state.walletInput.map((c, index) => {
                                return <div key={index}>
                                    <Col md={12} >
                                        {index >= 1 ? <Image key={index} className='ob-modal-body-del' src={DeleteIcon} onClick={() => this.deleteInputField(index + 1)} /> : null}
                                        <input
                                            autoFocus
                                            name={`wallet${index + 1}`}
                                            className={`inter-display-regular f-s-16 lh-20 ob-modal-body-text ${this.state.walletInput[index].address ? 'is-valid' : null}`}
                                            placeholder='Paste your wallet address here'
                                            onChange={(e) => this.handleOnChange(e)} />
                                        {this.props.OnboardingState.walletList.map((e, i) => {
                                            if (this.state.walletInput[index].address && e.id === `wallet${index + 1}` && e.coins && e.coins.length > 0) {
                                                return <CustomChip coins={e.coins} key={i}></CustomChip>
                                            }
                                        })}
                                    </Col>
                                </div>
                            })}
                        </Row>
                        <Row>
                            {this.state.addButtonVisible ?
                                <Col md={12} className='ob-modal-body-2'>
                                    <Button className="grey-btn" onClick={this.addInputField}>
                                        <img src={PlusIcon} /> Add another
                                    </Button>
                                </Col>
                                : null
                            }
                        </Row>
                        <Row>
                            <Col className='ob-modal-body-btn' md={12}>
                                <CustomButton className="secondary-btn m-r-15 preview" buttonText="Preview demo instead" />
                                <CustomButton className="primary-btn go-btn" type={"submit"} isDisabled={!this.state.walletInput.wallet1} buttonText="Go" />
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    OnboardingState: state.OnboardingState
});
const mapDispatchToProps = {
    getAllCoins,
    detectCoin
}
AddWallet.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);