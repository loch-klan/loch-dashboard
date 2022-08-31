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

class AddWallet extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            addButtonVisible: false,
            walletInput: [{ "wallet1": "" }]
        }
        this.timeout = 0
        this.handleOnChange = this.handleOnChange.bind(this);
    }


    componentDidMount() {
        this.props.getAllCoins()
    }

    handleOnChange = (e) => {
        let { name, value } = e.target;
        this.state.walletInput[name] = value
        this.setState({
            addButtonVisible: this.state.walletInput['wallet1'],
            ...this.state.walletInput
        });
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
            this.getCoinBasedOnWalletAddress(value);
        }, 300)
    }

    getCoinBasedOnWalletAddress = (value) => {
        if (this.props.OnboardingState.coinsList && value) {
            for (let i = 0; i < this.props.OnboardingState.coinsList.length; i++) {
                this.props.detectCoin({
                    coin: this.props.OnboardingState.coinsList[i].code,
                    address: value
                })
            }
        }
    }

    addInputField = (index) => {
        this.state.walletInput.push({ ['wallet' + index]: "" })
        this.setState({
            ...this.state.walletInput
        });
    }

    deleteInputField = (index) => {
        delete this.state.walletInput["wallet" + index];
        delete this.state.walletInput[index - 1]
        this.setState({
            ...this.state
        });

    }

    render() {
        // console.log(this.props.OnboardingState.coinsList)
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
                                            className={`inter-display-regular f-s-16 lh-20 ob-modal-body-text walletInput.wallet${index + 1}`}
                                            placeholder='Paste your wallet address here'
                                            onChange={this.handleOnChange} />
                                        {/* <CustomChip
                                        isIcon={true}
                                        coinText="Ethereum"
                                        coinImage={Ether}
                                    ></CustomChip> */}
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