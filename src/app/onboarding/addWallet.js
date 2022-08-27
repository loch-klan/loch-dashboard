import React from 'react';
import BaseReactComponent from "../../utils/form/BaseReactComponent";
import { connect } from "react-redux";
import { Button, Image } from "react-bootstrap";
import deleteicon from "../../image/Vector-delete.svg";
import plusicon from "../../image/Vector-plus.svg";
import infoicon from "../../image/Vector-info.svg";
import CustomButton from "../../utils/form/CustomButton";
import CustomTextControl from "../../utils/form/CustomTextControl";
import Form from "../../utils/form/Form";
import FormElement from "../../utils/form/FormElement";
import FormValidator from "../../utils/form/FormValidator";
import { Col, Container, Row } from 'react-bootstrap';

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
            }]
        }
        // this.onClose = this.onClose.bind(this);  
        this.handleOnChange = this.handleOnChange.bind(this);
    }


    componentDidMount() { }

    handleOnChange = (index) => {
        // let stateVariableUpdate = `${wallet + index}`;
        // // if (this.state["wallet1"]) {
        // let state = { ...this.state };
        // state.walletArray.wallet1 = this.state["wallet1"];
        // this.setState({
        //     ...state
        // })
        // }
        if (this.state.walletArrayCount > 1 || this.state.walletArray.wallet1) {
            this.setState({
                addButtonVisible: true
            });
        }
        else {
            this.setState({
                addButtonVisible: false
            });
        }

        // if (Object.keys(this.state.walletArray).indexOf("wallet" + index) > -1) {
        //     let state = { ...this.state };
        //     state.walletArray.wallet1 = this.state["wallet1"];
        //     this.setState()
        // }

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
    // handleOnChange = () => {
    //     this.setState({ addButtonVisible: true})
    // }

    render() {
        return (
            <>
                <Form onValidSubmit={this.onValidSubmit}>
                    <Container>
                        <Row>
                            {/* {this.state.walletArrayCount && this.state.walletArrayCount.map((e) => { */}
                            {/* {Array.from(Array(this.state.walletArrayCount)).map((c, index) => { */}
                            {this.state.walletArray.map((c, index) => {
                                return <Col md={12} className="ob-modal-body-1">
                                    {index >= 1 ? <Image key={index} className='ob-modal-body-del' src={deleteicon} onClick={() => this.deleteInputField(index + 1)} /> : null}
                                    <FormElement className=" inter-display-regular f-s-16 lh-20 ob-modal-body-text"
                                        key={c}
                                        valueLink={this.linkState(this, `walletArray.wallet${index + 1}`, () => this.handleOnChange(index + 1))}
                                        required
                                        validations={[
                                            {
                                                validate: FormValidator.isRequired,
                                                message: "Field cannot be empty"
                                            }
                                        ]}
                                        control={{
                                            type: CustomTextControl,
                                            settings: {
                                                placeholder: "Paste your wallet address here"
                                            }
                                        }}
                                    />
                                </Col>
                            })}
                            {this.state.addButtonVisible ?
                                <Col md={12} className='ob-modal-body-2'>
                                    <Button className="grey-btn" onClick={this.addInputField}>
                                        <img src={plusicon} /> Add another
                                    </Button>
                                </Col>
                                : null
                            }
                            <Col className='ob-modal-body-btn' md={12}>
                                {/* <CustomButton className="primary-btn" type={"submit"} handleClick={() => { this.setValue("now") }} variant="success" buttonText={!this.state.isVerificationRequired ? "Send Verification" : "Enter Code"} /> */}
                                {/* <CustomButton handleClick={() => { this.setValue("later") }} buttonText="Later" /> */}
                                <CustomButton className="secondary-btn m-r-15" buttonText="Preview demo instead" />
                                <CustomButton className="primary-btn" type={"submit"} buttonText="Go" />
                            </Col>
                        </Row>
                    </Container>
                </Form>

                {/* 
                <div className='ob-modal-body-1'>
                    {this.state.addButtonVisible ?
                        <img className='ob-modal-body-del' src={deleteicon} />
                        : null
                    }
                    <input className='inter-display-regular f-s-16 lh-20 ob-modal-body-text' placeholder='Paste your wallet address here' onChange={this.handleOnChange} />
                </div>
                {this.state.addButtonVisible ?
                    <div className='ob-modal-body-2'>
                        <Button className="grey-btn">
                            <img src={plusicon} /> Add another
                        </Button>
                    </div>
                    : null
                }


                <div className='ob-modal-body-btn'>
                    <Button className="secondary-btn m-r-15">
                        Preview demo instead
                    </Button>
                    <Button className="primary-btn" >
                        Go
                    </Button>
                </div> */}
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