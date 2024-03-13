import React from "react";
import { Breadcrumb, Button, Form, Image } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { ExportIcon } from "../../assets/images/icons";
import InActiveHomeSmallIcon from "../../assets/images/icons/InactiveHomeSmallIcon.svg";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import {
  AssetValueExplainer,
  ConnectExPopup,
  WalletConnectExchange,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import ConnectModal from "./ConnectModal";

export default function PageHeader(props) {
  const nav_list = window.location.pathname.split("/");
  const [connectModal, setconnectModal] = React.useState(false);
  const history = useHistory();

  const [popupModal, setpopupModal] = React.useState(false);
  const handlePopup = () => {
    let lochUser = JSON.parse(window.sessionStorage.getItem("lochUser"));
    if (!lochUser) {
      setpopupModal(!popupModal);

      setTimeout(() => {
        if (popupModal) {
          ConnectExPopup({
            session_id: getCurrentUser().id,
            email_address: getCurrentUser().email,
            from: "Wallet connect exchange",
          });
          if (props.updateTimer) {
            props.updateTimer();
          }
        }
      }, 200);
    }
  };

  const handleConnectModal = () => {
    setconnectModal(!connectModal);
    setTimeout(() => {
      if (connectModal) {
        WalletConnectExchange({
          session_id: getCurrentUser().id,
          email_address: getCurrentUser().email,
        });
        if (props.updateTimer) {
          props.updateTimer();
        }
      }
    }, 200);
  };

  const breads = nav_list.map((e, key) => {
    // console.log(e, props?.topaccount, key);
    let linkName = e;
    if (linkName === "intelligence") {
      return null;
    } else if (linkName === "transaction-history") {
      linkName = "transactions";
    } else if (linkName === "asset-value") {
      linkName = "historic performance";
    } else if (linkName === "top-accounts") {
      linkName = "leaderboard";
    }
    return (
      e && (
        <>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{
              to:
                props?.topaccount && key === 2
                  ? `/${nav_list[1]}/${e}`
                  : `/${e}`,
            }}
            className="inter-display-medium f-s-13 lh-16"
            active={e === props.currentPage}
            key={key}
          >
            {linkName ? linkName.replace(/-/g, " ") : e.replace(/-/g, " ")}
          </Breadcrumb.Item>
        </>
      )
    );
  });
  const breadCrumb = (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/home` }}>
        <Image src={InActiveHomeSmallIcon} />
      </Breadcrumb.Item>
      {breads}
    </Breadcrumb>
  );
  return (
    <div
      className={`page-header ${
        props.showpath || props?.topaccount ? "history-header" : ""
      }`}
      style={
        props?.bottomPadding
          ? { paddingBottom: props?.bottomPadding + "rem" }
          : { padding: 0 }
      }
    >
      <div>{props.showpath ? breadCrumb : ""}</div>

      <div className="header">
        <div className="header-left">
          {props.showImg ? (
            <div className="m-r-16 show-img">
              <Image src={props.showImg} />
            </div>
          ) : props?.multipleImg ? (
            <div className="multiple-img m-r-16">
              {props.multipleImg.map((e, i) => {
                return (
                  <Image
                    src={e}
                    style={{
                      zIndex: props.multipleImg?.length - i,
                      marginLeft: i === 0 ? "0" : "-2.7rem",
                    }}
                  />
                );
              })}
            </div>
          ) : (
            ""
          )}
          <div>
            <div style={{ display: "flex" }}>
              <h4
                className={`inter-display-medium f-s-24 lh-30 ${
                  props.showImg || props.multipleImg ? "" : "m-b-8"
                }`}
              >
                {props.title}
              </h4>
              {props.showNetflowExplainers ? null : props.showExplainers &&
                props.explainerText ? (
                <div
                  style={{
                    marginLeft: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CustomOverlay
                    position="bottom"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    className={"fix-width tool-tip-container-bottom-arrow"}
                    text={props.explainerText}
                  >
                    <Image
                      src={InfoIcon}
                      className="infoIcon"
                      style={{ cursor: "pointer", height: "1.6rem" }}
                    />
                  </CustomOverlay>
                </div>
              ) : null}
            </div>
            {props.subTitle ? (
              <p
                className="inter-display-medium f-s-16 lh-19"
                style={{
                  color: "var(--secondaryTextColor)",
                }}
              >
                {props.subTitle}{" "}
                {props.showNetflowExplainers ? (
                  <CustomOverlay
                    showNetflowExplainers={props.showNetflowExplainers}
                    position="bottom"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    className={"fix-width tool-tip-container-bottom-arrow"}
                    isLeftText
                  >
                    <Image
                      src={InfoIcon}
                      className="infoIcon"
                      style={{ cursor: "pointer", height: "1.6rem" }}
                    />
                  </CustomOverlay>
                ) : props.hoverText ? (
                  <CustomOverlay
                    position="bottom"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={props.hoverText}
                    className={"fix-width tool-tip-container-bottom-arrow"}
                  >
                    <Image
                      src={InfoIcon}
                      className="info-icon"
                      style={{
                        width: "1.6rem",
                        marginTop: "-3px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={() => {
                        AssetValueExplainer({
                          session_id: getCurrentUser().id,
                          email_address: getCurrentUser().email,
                        });
                        if (props.updateTimer) {
                          props.updateTimer();
                        }
                      }}
                    />
                  </CustomOverlay>
                ) : (
                  ""
                )}
              </p>
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          {props.showData && !props.isLoading && (
            <span className="space-grotesk-medium f-s-32 lh-38 m-r-24 va-m">
              {CurrencyType(false)} {numToCurrency(props.showData)}{" "}
              {CurrencyType(true)}
            </span>
          )}
        </div>
        {/* search */}

        {(props.btnText || props.SecondaryBtn || props.ShareBtn) && (
          <div>
            {props.SecondaryBtn && (
              <Button
                className="secondary-btn white-bg"
                onClick={handleConnectModal}
              >
                Connect exchange
              </Button>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              {props.showHideDust && props.showHideDustFun ? (
                <div
                  onClick={props.showHideDustFun}
                  className="pageHeaderShareContainer"
                  style={{ marginRight: props.ShareBtn ? "0.4rem" : "" }}
                >
                  <div className="smaller-toggle inter-display-medium f-s-13 pageHeaderShareBtn">
                    <Form.Check
                      type="switch"
                      checked={props.showHideDustVal}
                      // onChange={(e) => {
                      //   this.setState({
                      //     switchselected: e.target.checked,
                      //   });
                      //   if (this.props.setSwitch) {
                      //     this.props.setSwitch();
                      //   }
                      // }}
                      label={
                        props.showHideDustVal
                          ? "Reveal dust (less than $1)"
                          : "Hide dust (less than $1)"
                      }
                    />
                  </div>
                  {/* <div className="inter-display-medium f-s-13 lh-19 pageHeaderShareBtn">
                    {props.showHideDustVal
                      ? "Reveal dust (less than $1)"
                      : "Hide dust (less than $1)"}
                  </div> */}
                </div>
              ) : null}
              {props.ExportBtn && (
                <div
                  onClick={props.handleExportModal}
                  className="pageHeaderShareContainer"
                  style={{ marginRight: props.ShareBtn ? "0.5rem" : "" }}
                >
                  <Image className="pageHeaderShareImg" src={ExportIcon} />
                  <div className="inter-display-medium f-s-13 lh-19 pageHeaderShareBtn">
                    Export
                  </div>
                </div>
              )}
              {/* {props.ShareBtn && (
                <CustomOverlay
                  position="top"
                  isIcon={false}
                  isInfo={true}
                  isText={true}
                  text={"Click to copy link"}
                >
                  <div
                    onClick={props.handleShare}
                    className="pageHeaderShareContainer"
                  >
                    <Image
                      className="pageHeaderShareImg"
                      src={SharePortfolioIconWhite}
                    />
                    <div className="inter-display-medium f-s-13 lh-19 pageHeaderShareBtn">
                      Share
                    </div>
                  </div>
                </CustomOverlay>
              )} */}
              {props.btnText && (
                <Button
                  className={`${
                    props.btnOutline ? "secondary-btn " : "primary-btn"
                  } ${props.mainThemeBtn ? "main-button-invert" : ""}`}
                  onClick={props.handleBtn}
                >
                  {props.btnText}
                </Button>
              )}
            </div>
          </div>
        )}

        {props.viewMore && (
          <h3
            // href={props.viewMoreRedirect}
            className="view-more"
            onClick={props.handleClick}
          >
            View more
          </h3>
        )}
      </div>

      {connectModal ? (
        <ConnectModal
          show={connectModal}
          onHide={handleConnectModal}
          history={history}
          headerTitle={"Connect exchanges"}
          modalType={"connectModal"}
          iconImage={LinkIcon}
          handleUpdate={props?.handleUpdate}
          openPopup={handlePopup}
          tracking="wallet page"
        />
      ) : (
        ""
      )}
    </div>
  );
}
