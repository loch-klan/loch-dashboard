import { connect } from "react-redux";
import { CustomCoin } from "../../utils/commonComponent";
import { BaseReactComponent } from "../../utils/form";
import React from "react";
import { loadingAnimation } from "../../utils/ReusableFunctions";

class NewHomeInputBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.inputRefCustom = React.createRef(null);
    this.state = {
      welcomeAddBtnLoading: false,
    };
  }

  focusInputfield = () => {
    const inputField = document.getElementById(
      `newWelcomeWallet-${this?.props?.index + 1}`
    );
    if (!this.props.c.coinFound && !this.props.c.nickname) {
      inputField.focus();
    }
  };
  onKeyPressInputPass = (event) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
    if (event.key === "Enter" && this.props.removeFocusOnEnter) {
      event.preventDefault();
      if (this.inputRefCustom?.current) {
        this.inputRefCustom.current.blur();
      }
    }
  };
  render() {
    const { c, index } = this.props;
    return (
      <div
        className={`new-homepage__body-search_input_body_container input-noshadow-dark ${
          this.props.isMobile
            ? "new-homepage__body-search_input_body_container-mobile"
            : ""
        }`}
        onClick={this.focusInputfield}
      >
        <div className="new-homepage__body-search_input_body">
          <div
            style={index === 9 ? { marginBottom: "0rem" } : {}}
            className="addWalletWrapper inter-display-regular f-s-15 lh-20"
          >
            <div
              className={`awInputWrapper ${
                this.props.walletInput[index].address
                  ? "isAwInputWrapperValid"
                  : null
              } ${this.props.isMobile ? "awInputWrapper-mobile" : ""}`}
            >
              {this.props.isMobile ? (
                <>
                  {c.showAddress && (
                    <div className="awTopInputWrapper">
                      <div className="awInputContainer">
                        <input
                          ref={this.inputRefCustom}
                          onKeyDown={this.onKeyPressInputPass}
                          id={`newWelcomeWallet-${index + 1}`}
                          name={`wallet${index + 1}`}
                          value={c.address || ""}
                          className={`inter-display-regular f-s-15 lh-20 awInput awInputTopBar`}
                          spellcheck="false"
                          placeholder={
                            this.props.isMobile
                              ? "Paste any wallet address or ENS"
                              : "Paste any wallet address or ENS to get started"
                          }
                          title={c.address || ""}
                          onChange={
                            this.props.handleOnChange
                              ? this.props.handleOnChange
                              : null
                          }
                          autoFocus={this.props.noAutofocus ? false : true}
                          autoComplete="off"
                          onFocus={(e) => {
                            if (this.props.FocusInInput) {
                              this.props.FocusInInput(e);
                            }

                            if (this.props.showisTrendingAddressesAddress) {
                              this.props.showisTrendingAddressesAddress();
                            }
                          }}
                        />
                      </div>
                      {(c.showAddress || c.showNickname) && (
                        <>
                          {this.props.walletInput?.map((e, i) => {
                            if (
                              this.props.walletInput[index].address &&
                              e.id === `wallet${index + 1}`
                            ) {
                              // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                              if (e.coinFound && e.coins.length > 0) {
                                if (this.props.onGoBtnClick) {
                                  // return null;
                                  if (this.props.isAddNewAddress) {
                                    return (
                                      <div className="addToAddressListMobileBtnContainer">
                                        <div
                                          className={`replaceAddressListMobileBtn ${
                                            this.props.goBtnDisabled
                                              ? "disableAddToAddressListMobileBtn"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            if (this.props.onGoBtnClick) {
                                              this.props.onGoBtnClick(true);
                                            }
                                          }}
                                          style={{
                                            pointerEvents: this.state
                                              .welcomeAddBtnLoading
                                              ? "none"
                                              : "",
                                          }}
                                        >
                                          {this.props.welcomeAddBtnLoading ? (
                                            loadingAnimation()
                                          ) : (
                                            <span className="dotDotText">
                                              Add
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div className="addToAddressListMobileBtnContainer">
                                        <div
                                          className={`addToAddressListMobileBtn ${
                                            this.props.goBtnDisabled
                                              ? "disableAddToAddressListMobileBtn"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            this.props.onGoBtnClick(false);
                                          }}
                                        >
                                          Add
                                        </div>
                                        <div
                                          className={`replaceAddressListMobileBtn ${
                                            this.props.goBtnDisabled
                                              ? "disableAddToAddressListMobileBtn"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            if (this.props.onGoBtnClick) {
                                              this.props.onGoBtnClick(true);
                                            }
                                          }}
                                        >
                                          Replace
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                                return (
                                  <CustomCoin
                                    isStatic
                                    coins={e.coins.filter(
                                      (c) => c.chain_detected
                                    )}
                                    key={i}
                                    isLoaded={true}
                                    hideMore={this.props.hideMore}
                                  />
                                );
                              } else {
                                if (
                                  e.coins.length ===
                                  this.props.OnboardingState.coinsList.length
                                ) {
                                  return (
                                    <CustomCoin
                                      isStatic
                                      coins={null}
                                      key={i}
                                      isLoaded={false}
                                      hideMore={this.props.hideMore}
                                    />
                                  );
                                } else {
                                  return (
                                    <CustomCoin
                                      isStatic
                                      coins={null}
                                      key={i}
                                      isLoaded={false}
                                      hideMore={this.props.hideMore}
                                    />
                                  );
                                }
                              }
                            } else {
                              return "";
                            }
                          })}
                        </>
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {c.coinFound && c.showNickname && (
                      <div
                        className={`awBottomInputWrapper ${
                          c.showAddress ? "mt-2" : ""
                        } ${
                          this.props.isMobile
                            ? "awBottomInputWrapper-mobile"
                            : ""
                        }`}
                      >
                        <div className="awInputContainer">
                          {c.nickname && c.nickname !== "" ? (
                            <div className="awLable">Private Nametag</div>
                          ) : null}
                          {/* <div className="awLable">Private Nametag</div> */}
                          <input
                            name={`wallet${index + 1}`}
                            value={c.nickname || ""}
                            autoComplete="off"
                            className={`inter-display-regular f-s-15 lh-20 awInput`}
                            placeholder={
                              this.props.isList
                                ? "Enter nametag"
                                : "Enter Private Nametag"
                            }
                            title={c.nickname || ""}
                            onChange={
                              this.props.nicknameOnChain
                                ? this.props.nicknameOnChain
                                : null
                            }
                            onBlur={(e) => {
                              // LandingPageNickname({
                              //   session_id: getCurrentUser().id,
                              //   email_address: getCurrentUser().email,
                              //   nickname: e.target?.value,
                              //   address: c.address,
                              // });
                            }}
                            onFocus={(e) => {
                              if (this.props.FocusInInput) {
                                this.props.FocusInInput(e);
                              }
                            }}
                          />
                        </div>
                        {/* {!c.showAddress &&
                      this.props.walletInput?.map((e, i) => {
                        if (
                          this.props.walletInput[index].address &&
                          e.id === `wallet${index + 1}`
                        ) {
                          // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                          if (e.coinFound && e.coins.length > 0) {
                            return (
                              <CustomCoin
                                isStatic
                                coins={e.coins.filter((c) => c.chain_detected)}
                                key={i}
                                isLoaded={true}
                                hideMore={this.props.hideMore}
                              />
                            );
                          } else {
                            if (
                              e.coins.length ===
                              this.props.OnboardingState.coinsList.length
                            ) {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={null}
                                  key={i}
                                  isLoaded={true}
                                  hideMore={this.props.hideMore}
                                />
                              );
                            } else {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={null}
                                  key={i}
                                  isLoaded={false}
                                  hideMore={this.props.hideMore}
                                />
                              );
                            }
                          }
                        } else {
                          return "";
                        }
                      })} */}
                        {/* {c.showNameTag && c.nameTag ? (
              <div className="awBlockContainer">
                <div className="awLable">Name tag</div>
                <div className="awNameTag">{c.nameTag}</div>
              </div>
            ) : null} */}
                      </div>
                    )}
                    {!c.showAddress && c.nickname && (
                      <>
                        {this.props.walletInput?.map((e, i) => {
                          if (
                            this.props.walletInput[index].address &&
                            e.id === `wallet${index + 1}`
                          ) {
                            // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                            if (e.coinFound && e.coins.length > 0) {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={e.coins.filter(
                                    (c) => c.chain_detected
                                  )}
                                  key={i}
                                  isLoaded={true}
                                  hideMore={this.props.hideMore}
                                />
                              );
                            } else {
                              if (
                                e.coins.length ===
                                this.props.OnboardingState.coinsList.length
                              ) {
                                return (
                                  <CustomCoin
                                    isStatic
                                    coins={null}
                                    key={i}
                                    isLoaded={true}
                                    hideMore={this.props.hideMore}
                                  />
                                );
                              } else {
                                return (
                                  <CustomCoin
                                    isStatic
                                    coins={null}
                                    key={i}
                                    isLoaded={false}
                                    hideMore={this.props.hideMore}
                                  />
                                );
                              }
                            }
                          } else {
                            return "";
                          }
                        })}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {c.showAddress && (
                    <div className="awTopInputWrapper">
                      <div className="awInputContainer">
                        <input
                          onKeyDown={this.props.onKeyDown}
                          id={`newWelcomeWallet-${index + 1}`}
                          name={`wallet${index + 1}`}
                          value={c.address || ""}
                          className={`inter-display-regular f-s-15 lh-20 awInput`}
                          placeholder={
                            this.props.isMobile
                              ? "Paste any wallet address or ENS"
                              : "Paste any wallet address or ENS to get started"
                          }
                          title={c.address || ""}
                          autoComplete="off"
                          onChange={
                            this.props.handleOnChange
                              ? this.props.handleOnChange
                              : null
                          }
                          autoFocus
                          onFocus={(e) => {
                            if (this.props.FocusInInput) {
                              this.props.FocusInInput(e);
                            }

                            if (this.props.showisTrendingAddressesAddress) {
                              this.props.showisTrendingAddressesAddress();
                            }
                          }}
                        />
                      </div>

                      {this.props.walletInput?.map((e, i) => {
                        if (
                          this.props.walletInput[index].address &&
                          e.id === `wallet${index + 1}`
                        ) {
                          // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                          if (e.coinFound && e.coins.length > 0) {
                            console.log("e.coins ", e.coins);
                            return (
                              <CustomCoin
                                isStatic
                                coins={e.coins.filter((c) => c.chain_detected)}
                                key={i}
                                isLoaded={true}
                                hideMore={this.props.hideMore}
                              />
                            );
                          } else {
                            if (
                              e.coins.length ===
                              this.props.OnboardingState.coinsList.length
                            ) {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={null}
                                  key={i}
                                  isLoaded={true}
                                />
                              );
                            } else {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={null}
                                  key={i}
                                  isLoaded={false}
                                  hideMore={this.props.hideMore}
                                />
                              );
                            }
                          }
                        } else {
                          return "";
                        }
                      })}
                    </div>
                  )}
                  {c.coinFound && c.showNickname && (
                    <div
                      className={`awBottomInputWrapper ${
                        c.showAddress ? "mt-2" : ""
                      } ${
                        this.props.isMobile ? "awBottomInputWrapper-mobile" : ""
                      }`}
                    >
                      <div className="awInputContainer">
                        {c.nickname && c.nickname !== "" ? (
                          <div className="awLable">Private Nametag</div>
                        ) : null}
                        {/* <div className="awLable">Private Nametag</div> */}
                        <input
                          name={`wallet${index + 1}`}
                          value={c.nickname || ""}
                          className={`inter-display-regular f-s-15 lh-20 awInput`}
                          placeholder="Enter Private Nametag"
                          title={c.nickname || ""}
                          autoComplete="off"
                          onChange={
                            this.props.nicknameOnChain
                              ? this.props.nicknameOnChain
                              : null
                          }
                          onBlur={(e) => {
                            // LandingPageNickname({
                            //   session_id: getCurrentUser().id,
                            //   email_address: getCurrentUser().email,
                            //   nickname: e.target?.value,
                            //   address: c.address,
                            // });
                          }}
                          onFocus={(e) => {
                            if (this.props.FocusInInput) {
                              this.props.FocusInInput(e);
                            }
                          }}
                        />
                      </div>
                      {!c.showAddress &&
                        this.props.walletInput?.map((e, i) => {
                          if (
                            this.props.walletInput[index].address &&
                            e.id === `wallet${index + 1}`
                          ) {
                            // if (e.coins && e.coins.length === this.props.OnboardingState.coinsList.length) {
                            if (e.coinFound && e.coins.length > 0) {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={e.coins.filter(
                                    (c) => c.chain_detected
                                  )}
                                  key={i}
                                  isLoaded={true}
                                />
                              );
                            } else {
                              if (
                                e.coins.length ===
                                this.props.OnboardingState.coinsList.length
                              ) {
                                return (
                                  <CustomCoin
                                    isStatic
                                    coins={null}
                                    key={i}
                                    isLoaded={true}
                                    hideMore={this.props.hideMore}
                                  />
                                );
                              } else {
                                return (
                                  <CustomCoin
                                    isStatic
                                    coins={null}
                                    key={i}
                                    isLoaded={false}
                                    hideMore={this.props.hideMore}
                                  />
                                );
                              }
                            }
                          } else {
                            return "";
                          }
                        })}
                      {/* {c.showNameTag && c.nameTag ? (
              <div className="awBlockContainer">
                <div className="awLable">Name tag</div>
                <div className="awNameTag">{c.nameTag}</div>
              </div>
            ) : null} */}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  OnboardingState: state.OnboardingState,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(NewHomeInputBlock);
