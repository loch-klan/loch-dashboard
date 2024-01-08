import { connect } from "react-redux";
import { CustomCoin } from "../../utils/commonComponent";
import { BaseReactComponent } from "../../utils/form";

class NewHomeInputBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { c, index } = this.props;
    return (
      <div className="new-homepage__body-search_input_body_container">
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
              }`}
            >
              <>
                {c.showAddress && (
                  <div className="awTopInputWrapper">
                    <div className="awInputContainer">
                      <input
                        id={`newWelcomeWallet-${index + 1}`}
                        name={`wallet${index + 1}`}
                        value={c.address || ""}
                        className={`inter-display-regular f-s-15 lh-20 awInput`}
                        placeholder="Paste any wallet address or ENS to get started"
                        title={c.address || ""}
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
                          return (
                            <CustomCoin
                              isStatic
                              coins={e.coins.filter((c) => c.chain_detected)}
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
                              />
                            );
                          } else {
                            return (
                              <CustomCoin
                                isStatic
                                coins={null}
                                key={i}
                                isLoaded={false}
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
                                coins={e.coins.filter((c) => c.chain_detected)}
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
                                />
                              );
                            } else {
                              return (
                                <CustomCoin
                                  isStatic
                                  coins={null}
                                  key={i}
                                  isLoaded={false}
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