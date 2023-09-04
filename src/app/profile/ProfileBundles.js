import React, { Component } from "react";
import { connect } from "react-redux";

import { setPageFlagDefault } from "../common/Api";
import PageHeader from "../common/PageHeader";
import { PencilIcon, ProfileGlobeIcon } from "../../assets/images/icons";
import AddBundleModal from "./AddBundleModal";
import { Col, Image, Row } from "react-bootstrap";
import ProfileBundlesBlock from "./ProfileBundlesBlock";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";

class ProfileBundles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBundleModal: false,
      editBundleModal: false,
      selectedBundle: 0,
      rawData: [
        {
          bundleName: "Bundle One",
          walletaddress: [
            {
              wallet_address: "0xd24400ae8BfEBb18cA49Be86258a3C749cf46853",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "mw3.eth",
              id: "wallet1",
              wallet_metadata: {},
            },
            {
              wallet_address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],

              display_address: "vitalik.eth",
              id: "wallet2",
              wallet_metadata: {},
            },
            {
              wallet_address: "0x00000000219ab540356cBB839Cbe05303d7705Fa",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "mw3.eth",
              id: "wallet1",
              wallet_metadata: {},
            },
            {
              wallet_address: "0x3BfC20f0B9aFcAcE800D73D2191166FF16540258",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "mw3.eth",
              id: "wallet4",
              wallet_metadata: {},
            },
          ],
        },
        {
          bundleName: "Bundle Two",
          walletaddress: [
            {
              wallet_address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "vitalik.eth",
              id: "wallet2",
              wallet_metadata: {},
            },
            {
              wallet_address: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "vitalik.eth",
              id: "wallet2",
              wallet_metadata: {},
            },
          ],
        },
        {
          bundleName: "Bundle Three",
          walletaddress: [
            {
              wallet_address: "0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "mw3.eth",
              id: "wallet1",
              wallet_metadata: {},
            },
            {
              wallet_address: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "vitalik.eth",
              id: "wallet2",
              wallet_metadata: {},
            },
            {
              wallet_address: "0xC61b9BB3A7a0767E3179713f3A5c7a9aeDCE193C",
              coinFound: true,
              chains: [
                {
                  chain_detected: true,
                  code: "ETH",
                  color: "#7B44DA",
                  name: "Ethereum",
                  symbol: "https://media.loch.one/loch-ethereum.svg",
                },
                {
                  chain_detected: true,
                  code: "ARB",
                  color: "#2C374B",
                  name: "Arbitrum",
                  symbol: "https://media.loch.one/loch-arbitrum.svg",
                },
                {
                  chain_detected: true,
                  code: "AVAX",
                  color: "#E84042",
                  name: "Avalanche",
                  symbol: "https://media.loch.one/loch-avalanche.svg",
                },
              ],
              display_address: "vitalik.eth",
              id: "wallet2",
              wallet_metadata: {},
            },
          ],
        },
      ],
      selectedWalletAddresses: [],
      selectedChainImages: [
        "https://media.loch.one/loch-ethereum.svg",
        "https://media.loch.one/loch-arbitrum.svg",
        "https://media.loch.one/loch-avalanche.svg",
        "https://media.loch.one/loch-ethereum.svg",
      ],
      selectedBundleName: "",
    };
  }

  selectAddressBundle = (index) => {
    this.setState(
      {
        selectedBundle: index,
        selectedBundleName: this.state.rawData[index].bundleName,
        selectedWalletAddresses: this.state.rawData[index].walletaddress,
      },
      () => {
        console.log("Changed ", this.state.selectedBundle);
      }
    );
  };
  componentDidMount() {
    this.setState({
      selectedBundleName:
        this.state.rawData[this.state.selectedBundle].bundleName,
      selectedWalletAddresses:
        this.state.rawData[this.state.selectedBundle].walletaddress,
    });
  }

  showCreateBundleModal = () => {
    this.setState(
      {
        editBundleModal: false,
      },
      () => {
        this.setState({ createBundleModal: true });
      }
    );
  };
  showEditBundleModal = () => {
    this.setState(
      {
        createBundleModal: false,
      },
      () => {
        this.setState({ editBundleModal: true });
      }
    );
  };
  hideAllModals = () => {
    this.setState({
      editBundleModal: false,
      createBundleModal: false,
    });
  };
  showEditBundleModalPass = (index) => {
    this.setState(
      {
        selectedBundle: index,
        selectedBundleName: this.state.rawData[index].bundleName,
        selectedWalletAddresses: this.state.rawData[index].walletaddress,
      },
      () => {
        this.showEditBundleModal();
      }
    );
  };
  render() {
    return (
      <>
        <PageHeader
          title="Bundles"
          titleImageUrl={ProfileGlobeIcon}
          titleImageClass="smallerHeadingImages"
          titleClass="smallerHeading"
          btnText="Create a bundle"
          handleBtn={this.showCreateBundleModal}
        />
        <Row className="addressBundleListContainer">
          {this.state.rawData.map((bundleData, index) => {
            return (
              <Col md={4}>
                <div
                  onClick={() => {
                    this.selectAddressBundle(index);
                  }}
                  className={`addressBundleListItem  ${
                    index === this.state.selectedBundle
                      ? "addressBundleListItemSelected"
                      : ""
                  }`}
                >
                  <div className="interDisplayMediumText f-s-16 lh-14 bundleWalletName">
                    <div>
                      <div>{bundleData.bundleName}</div>
                      <h4 className="interDisplayMediumText f-s-14 lh-14 mt-3 grey-7C7">
                        {numToCurrency(37491)}
                        <span className="f-s-10 grey-ADA">
                          {CurrencyType(true)}
                        </span>
                      </h4>
                    </div>
                    <div className="bundleWalletNameRight">
                      <Image
                        onClick={(e) => {
                          e.stopPropagation();
                          this.showEditBundleModalPass(index);
                        }}
                        className="bundleWalletEditIcon"
                        src={PencilIcon}
                      />
                    </div>
                  </div>
                  <ProfileBundlesBlock
                    bundleData={bundleData}
                    index={index}
                    onBundleClick={this.selectAddressBundle}
                    showEditBundleModal={this.showEditBundleModalPass}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
        {this.state.createBundleModal ? (
          <AddBundleModal
            show
            onHide={this.hideAllModals}
            history={this.props.history}
            iconImage={ProfileGlobeIcon}
            headerTitle={"Create an address bundle"}
            total_addresses={0}
            updateTimer={this.updateTimer}
          />
        ) : null}

        {this.state.editBundleModal ? (
          <AddBundleModal
            show
            onHide={this.hideAllModals}
            history={this.props.history}
            iconImage={ProfileGlobeIcon}
            headerTitle={"Create an address bundle"}
            total_addresses={0}
            updateTimer={this.updateTimer}
            //Edit

            isEdit
            walletaddress={this.state.selectedWalletAddresses}
            goToEdit={this.showEditBundleModal}
            chainImages={this.state.selectedChainImages}
            bundleName={this.state.selectedBundleName}
          />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  profileState: state.ProfileState,
});
const mapDispatchToProps = {
  setPageFlagDefault,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileBundles);
