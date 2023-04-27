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
import SignInPopupIcon from "../../assets/images/icons/loch-icon.svg";
import AuthModal from "./AuthModal";
import { AssetValueExplainer, ConnectExPopup, WalletConnectExchange } from "../../utils/AnalyticsFunctions";
import { getCurrentUser } from "../../utils/ManageToken";
import SearchIcon from "../../assets/images/icons/search-icon.svg";

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
      }
    }, 200);
     
   };

  const breads = nav_list.map((e, key) => {
    // console.log(e , props.currentPage)
    return (
      e && (
        <>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: `/${e}` }}
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
      className={`m-b-40 page-header ${props.showpath ? "history-header" : ""}`}
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

        {(props.btnText ||
          props.SecondaryBtn ||
          props.ShareBtn ||
          props?.handleSearch) && (
          <div style={props?.handleSearch ? {
            display:"flex", alignItems:"center", justifyContent:"flex-end",width:"45rem"
          }:{}}>
            {props?.handleSearch && (
              <div className="page-search-wrapper">
                <Image src={SearchIcon} />
                <input
                  type="text"
                  placeholder="Search"
                  onChange={props?.handleSearch}
                  className="page-search-input"
                />
              </div>
            )}
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
            View More
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
          handleUpdate={props.handleUpdate}
          openPopup={handlePopup}
          tracking="wallet page"
        />
      ) : (
        ""
      )}

      {popupModal ? (
        <AuthModal
          show={popupModal}
          onHide={handlePopup}
          history={history}
          modalType={"create_account"}
          iconImage={LinkIcon}
          hideSkip={true}
          title="Don’t lose your data"
          description="Don’t let your hard work go to waste. Add your email so you can analyze your CeFi and DeFi portfolio together"
          stopUpdate={true}
          tracking="Wallet connect exchange"
        />
      ) : (
        ""
      )}
    </div>
  );

}
