import React from 'react'
import {BaseReactComponent, CustomTextControl, Form, FormElement} from './../../utils/form';
import { connect } from 'react-redux';
import { Modal, Image, Button } from 'react-bootstrap';
import CloseIcon from '../../assets/images/icons/dummyX.svg'
import { FeedbackType } from '../../utils/Constant';
import downBlack from '../../assets/images/icons/thumbs-down-black.svg';
import upBlack from '../../assets/images/icons/thumbs-up-black.svg';
import { sendFeedbackApi } from './Api';

class FeedbackModal extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      feedback: "",
    };
  }
  handleSubmit = ()=>{
    let data = new URLSearchParams();
    data.append("page", this.props.page)
    data.append("feedback_type", this.props.feedbackType)
    data.append("feedback", this.state.feedback)
    sendFeedbackApi(data, this);
  }

  render() {
    const {feedbackType, show, onHide}=this.props;
    return (
      <Modal
        show={show}
        className="exit-overlay-form"
        onHide={onHide}
        size="lg"
        dialogClassName={"exit-overlay-modal feedback-modal"}
        centered
        aria-labelledby="contained-modal-title-vcenter"
        backdropClassName="exitoverlaymodal"
      >
        <Modal.Header>
          <div className="api-modal-header">
            <Image src={feedbackType === FeedbackType.POSITIVE ? upBlack : downBlack} />
          </div>
          <div className="closebtn" onClick={onHide}>
            <Image src={CloseIcon} />
          </div>
        </Modal.Header>
        <Modal.Body>
          <h6 className="inter-display-medium f-s-25 lh-30 m-b-8 black-191">
            {feedbackType === FeedbackType.POSITIVE ? "Let us know what you like" : "Let us know what went wrong"}
          </h6>
          <p className='inter-display-medium f-s-16 lh-19 grey-969'>Share your thoughts</p>
          <Form>
            <FormElement
              valueLink={this.linkState(this,"feedback")}
              label="Feedback"
              control={{
                type: CustomTextControl,
                settings: {
                  placeholder: "I feel the buttons should be bigger",
                  as: "textarea",
                  rows: 6,
                },
              }}
              classes={{
                inputField: this.state.feedback !== "" ? "done" : "",
              }}
            />
            <div className='button-wrapper'>
              <Button className='secondary-btn' onClick={onHide}>Cancel</Button>
              <Button className='primary-btn' onClick={this.handleSubmit}>Submit</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
}
FeedbackModal.propTypes = {
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal);