import React from "react";
import { Button, Breadcrumb, Image } from "react-bootstrap";
import InActiveHomeSmallIcon from "../../assets/images/icons/InactiveHomeSmallIcon.svg";
import { Link } from "react-router-dom";
import { CurrencyType, numToCurrency } from "../../utils/ReusableFunctions";
import CustomOverlay from "../../utils/commonComponent/CustomOverlay";
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LinkIcon from "../../assets/images/icons/link.svg";
import ConnectModal from "./ConnectModal";
import { useHistory } from "react-router-dom";
import {
  AssetValueExplainer,
  ConnectExPopup,
  WalletConnectExchange,
} from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";

export default function PageHeader(props) {
  const nav_list = window.location.pathname.split("/");
  const [connectModal, setconnectModal] = React.useState(false);
  const history = useHistory();

  const [popupModal, setpopupModal] = React.useState(false);
  const handlePopup = () => {
    let lochUser = JSON.parse(localStorage.getItem("lochUser"));
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
            {e.replace(/-/g, " ")}
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
      className={`m-b-40 page-header ${
        props.showpath || props?.topaccount ? "history-header" : ""
      }`}
      style={
        props?.bottomPadding
          ? { paddingBottom: props?.bottomPadding + "rem" }
          : { padding: 0 }
      }
    >
      {props.showpath ? breadCrumb : ""}

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
            <h4
              className={`inter-display-medium f-s-24 lh-30 ${
                props.showImg || props.multipleImg ? "" : "m-b-8"
              }`}
            >
              {props.title}
            </h4>
            {props.subTitle ? (
              <p className="inter-display-medium f-s-16 lh-19">
                {props.subTitle}{" "}
                {props.hoverText ? (
                  <CustomOverlay
                    position="top"
                    isIcon={false}
                    isInfo={true}
                    isText={true}
                    text={props.hoverText}
                    className={"fix-width"}
                  >
                    <Image
                      src={InfoIcon}
                      className="info-icon"
                      style={{ width: "1.6rem", marginTop: "-3px" }}
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
            {props.ShareBtn && (
              <CustomOverlay
                position="top"
                isIcon={false}
                isInfo={true}
                isText={true}
                text={"Click to copy link"}
              >
                <Button
                  className="secondary-btn white-bg"
                  style={!props.btnText ? { marginRight: "0rem" } : {}}
                  onClick={props.handleShare}
                >
                  Share
                </Button>
              </CustomOverlay>
            )}
            {props.btnText && (
              <Button
                className={`${
                  props.btnOutline ? "secondary-btn" : "primary-btn"
                }`}
                onClick={props.handleBtn}
              >
                {props.btnText}
              </Button>
            )}
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
