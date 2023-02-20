import React from 'react'
import { Modal, Image, Button } from 'react-bootstrap';
import CloseIcon from '../../assets/images/icons/dummyX.svg'
import SharePortfolioIcon from '../../assets/images/icons/SharePortfolioIcon.svg'
import { CustomTextControl, FormElement, FormValidator } from '../../utils/form';
import CopyLink from '../../assets/images/icons/CopyLink.svg';
import ViewOnlyImage from '../../assets/images/icons/ViewOnlyImage.svg';
import share from '../../assets/images/icons/share.svg';
import ShareLink from '../../assets/images/icons/ShareLink.svg'
import CustomOverlay from '../../utils/commonComponent/CustomOverlay';
import InfoIcon from "../../assets/images/icons/info-icon.svg";
import LockIcon from "../../assets/images/icons/lock-icon.svg";
import { BASE_URL_S3 } from '../../utils/Constant';
import { toast } from 'react-toastify';
import { ShareLinkCopy } from '../../utils/AnalyticsFunctions';
import { getCurrentUser } from '../../utils/ManageToken';



function SharePortfolio(props) {
  let lochUser = JSON.parse(localStorage.getItem('lochUser'));
  // let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
    let shareLink = BASE_URL_S3 + "home/" + lochUser.link;
  return (
    <div>
        <Modal
        show={props.show}
        className="exit-overlay-form"
        // backdrop="static"
        onHide={props.onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
            <div className="exitOverlayIcon">
              <Image src={SharePortfolioIcon} />
            </div>
            <div className="closebtn" onClick={props.onHide}>
                <Image src={CloseIcon} />
            </div>
        </Modal.Header>
        <Modal.Body>
          <div className='share-modal-body'>
              <h6 className="inter-display-medium f-s-20 lh-24 m-b-8 black-000">
                {props.headerTitle}
              </h6>
              <p className="inter-display-medium f-s-16 lh-19 grey-7C7">
                Share this portfolio with your friends or coworkers.
                <br/>
                Don't worry only you have edit access. The link remains anonymous.
              </p>

              <div className='links'>
                <div className="inter-display-medium f-s-16 lh-19 black-191 linkInfo">
                  <span className='link-text'>{shareLink}</span>
                  <span className="link" onClick={()=>{
                    navigator.clipboard.writeText(shareLink);
                  toast.success("Share link has been copied");
                  ShareLinkCopy({session_id: getCurrentUser().id, email_address:getCurrentUser().email, link:shareLink});
                    }}>
                      <Image src={CopyLink} className="m-r-8" />
                      <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                        Copy link
                      </h3>
                  </span>
                </div>
              </div>
              {/* <div className="buttons-section">
                <Image src={ViewOnlyImage} />
                <div className='share-button'>
                  <Image src={share} />
                  <h3 className="inter-display-medium f-s-16 lh-19 black-191">
                    Share
                  </h3>
                </div>
              </div> */}
              <div className="m-b-36 footer">
                <p className="inter-display-medium f-s-13 lh-16 grey-ADA m-r-5">
                  At Loch, we care intensely about your privacy and anonymity.
                </p>
                <CustomOverlay
                  text="We do not link wallet addresses back to you unless you explicitly give us your email or phone number."
                  position="top"
                  isIcon={true}
                  IconImage={LockIcon}
                  isInfo={true}
                  className={"fix-width"}
                >
                  <Image
                    src={InfoIcon}
                    className="info-icon"
                    // onMouseEnter={this.leavePrivacy}
                  />
                </CustomOverlay>
              </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default SharePortfolio