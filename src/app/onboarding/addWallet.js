import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import DeleteIcon from "../../assets/images/icons/delete-icon.svg";
import PlusIcon from "../../assets/images/icons/plus-icon-grey.svg";
import CustomButton from "../../utils/form/CustomButton";
import CustomTextControl from "../../utils/form/CustomTextControl";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import { Col, Container, Row } from 'react-bootstrap';
import ReactDOM from "react-dom";
import CustomChip from '../../utils/commonComponent/CustomChip';
import Ether from "../../assets/images/icons/ether-coin.svg";

class AddWallet extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            showModal: true,
            signIn: false,
            addButtonVisible: false,
            wallet: "",
            walletArrayCount: 1,
            walletArray: [{
                wallet1: ""
            }],
        }
        this.handleOnChange = this.handleOnChange.bind(this);
    }


    componentDidMount() { }

    handleOnChange = (e, index) => {
        if (this.state.walletArrayCount > 1) {
            this.state.walletArray.wallet1 = e.target.value;
            this.setState({
                addButtonVisible: this.state.walletArray.wallet1 != "",
                ...this.state.walletArray
            });
        } else {
            this.state.walletArray[index] = e.target.value
            this.setState({
                addButtonVisible: this.state.walletArray.wallet1 != "",
                ...this.state.walletArray
            });
        }
    }

    addInputField = (index) => {
        this.state.walletArray.push({ ['wallet' + index]: "" })
        this.setState({
            ...this.state
        });
    }

    deleteInputField = (index) => {
        delete this.state.walletArray["wallet" + index];
        delete this.state.walletArray[index - 1]
        this.setState({
            ...this.state
        });

    }

    render() {
        return (
            <>
                <Form onValidSubmit={this.onValidSubmit}>
                    <Container>
                        <Row className="ob-modal-body-1">
                            {this.state.walletArray.map((c, index) => {
                                return <>
                                <Col md={12} >
                                    {index >= 1 ? <Image key={index} className='ob-modal-body-del cp' src={DeleteIcon} onClick={() => this.deleteInputField(index + 1)} /> : null}
                                    <input
                                        autoFocus
                                        className={`inter-display-regular f-s-16 lh-20 ob-modal-body-text walletArray.wallet${index + 1}`}
                                        placeholder='Paste your wallet address here'
                                        onChange={(e) => this.handleOnChange(e, `wallet${index + 1}`)} />
                                    <CustomChip
                                        isIcon={true}
                                        coinText="Ethereum"
                                        coinImage={Ether}
                                    ></CustomChip>
                                </Col>
                                </>
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
                                <CustomButton className="secondary-btn m-r-15" buttonText="Preview demo instead" />
                                <CustomButton className="primary-btn" type={"submit"} isDisabled={!this.state.walletArray.wallet1} buttonText="Go" />
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </>
        );
    }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
AddWallet.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWallet);