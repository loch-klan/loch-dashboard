import React from 'react'
import { Modal, Image, Button } from 'react-bootstrap'
import closeIcon from '../../assets/images/icons/close-icon.svg'
import { connect } from 'react-redux';
import {updateWalletApi , getAllWalletListApi, getAllWalletApi, deleteWallet} from './Api.js'
import unrecognisedIcon from '../../image/unrecognised.png';
import { SelectControl, FormElement, CustomTextControl, FormValidator, BaseReactComponent, Form } from '../../utils/form';
class EditWalletModal extends BaseReactComponent {
    constructor(props) {
        super(props);
        this.state = {
            createdOn:props.createdOn,
            walletAddress: props.walletAddress,
            walletName: props.walletMetaData ? props.walletMetaData.id : "",
            walletTag: props.walletMetaData ? props.walletMetaData.tag : "",
            walletMetaData: props.walletMetaData,
            walletNameList: [],
            dropDownActive:{},
            coinchips:props.coinchips,
        }
    }

    componentDidMount(){
      getAllWalletApi(this)
    }

    onValidSubmit = () => {
        let data = new URLSearchParams()
        data.append("wallet_address",this.state.walletAddress)
        data.append("wallet_id",this.state.walletName)
        data.append("tag",this.state.walletTag)
        updateWalletApi(this,data);
    };

    handleDelete = ()=>{
        let data = new URLSearchParams()
        data.append("wallet_address",this.state.walletAddress)
        deleteWallet(this,data)
    }

    getDays = (d)=>{
      const date = new Date()
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let today = `${year}-${month}-${day}`
      return (new Date(today).getTime() - new Date(d.split(' ')[0]).getTime()) / (1000*3600*24)
    }
    render() {
        const chips = this.state.coinchips.map((e, index) => {
            return (
                <div className='chipcontainer' key={index}>
                    <Image src={e.chain.symbol} />
                    <div className='inter-display-medium f-s-13 lh-16' >{e.chain.name}</div>
                </div>
            )
        })
        const { walletMetaData, walletNameList, walletName } = this.state;
        const {show, handleClose, onHide } = this.props;
        let walletIcon, walletBdColor;
        walletNameList.map((item)=>{
          if(item.id === walletName){
            return (
              walletIcon = item.symbol,
              walletBdColor = item.color
              )
          }
        })
        return (
            <Modal
                show={show}
                onClick={handleClose}
                className="edit-wallet-form"
                onHide={onHide}
                size="lg"
                dialogClassName={"edit-wallet-modal"}
                centered
                aria-labelledby="contained-modal-title-vcenter"
                backdropClassName="editmodal"
            >
                <Modal.Header style={{backgroundColor: walletBdColor ? walletBdColor : "#E98430"}}>
                    <Image src={walletIcon ? walletIcon : unrecognisedIcon} className="walletIcon" />
                    <div className="closebtn" onClick={onHide}>
                        <Image src={closeIcon} />
                    </div>
                    <div className='triangle-up'></div>
                </Modal.Header>
                <Modal.Body>
                  <div className='edit-wallet-body'>
                    <Form onValidSubmit={this.onValidSubmit}>
                      <FormElement
                        valueLink={this.linkState(this, "walletName")}
                        required
                        validations={[
                          {
                            validate: FormValidator.isRequired,
                            message: "Please select a wallet name"
                          }
                        ]}
                        control={{
                          type: SelectControl,
                          settings: {
                            placeholder: "Select wallet type",
                            options: walletNameList,
                            multiple: false,
                            searchable: true,
                            onChangeCallback: (onBlur) => {
                              onBlur(this.state.walletName);
                            }
                          }
                        }}
                      />
                      <p className='inter-display-regular f-s-13 lh-16 m-b-16 subtitle'>{ `added ${this.getDays(this.state.createdOn)} days ago`}</p>
                      <div className='m-b-32 coinchips'>{chips}</div>
                      <div className='edit-form'>
                          <FormElement
                                    valueLink={this.linkState(this, "walletAddress")}
                                    label="Wallet Address"
                                    disabled
                                    control={{
                                        type: CustomTextControl,
                                    }}
                                    classes={{
                                      inputField: "disabled-input",
                                    }}
                                />
                                <FormElement
                                    valueLink={this.linkState(this, "walletTag")}
                                    label="Wallet tag"
                                    control={{
                                        type: CustomTextControl,
                                        settings: {
                                            placeholder: "My main wallet",
                                        }
                                    }}
                                    classes={{
                                      inputField: "tag-input",
                                    }}
                                />
                                <div className='edit-btns'>
                                    <Button className="inter-display-semi-bold f-s-16 lh-19 m-r-24 delete-btn" onClick={this.handleDelete}>
                                        Delete wallet
                                    </Button>
                                    <Button className='primary-btn' type="submit">Save changes</Button>
                                </div>

                        </div>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal >
        )
    }
}

const mapStateToProps = state => ({
    walletState: state.WalletState,
});
const mapDispatchToProps = {
  updateWalletApi,
  getAllWalletListApi,
  deleteWallet,
}
EditWalletModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(EditWalletModal);