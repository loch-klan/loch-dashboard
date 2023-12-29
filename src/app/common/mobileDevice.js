import React from "react";
import { connect } from "react-redux";
import {
  BaseReactComponent,
  CustomTextControl,
  Form,
  FormElement,
  FormValidator,
} from "../../utils/form";
// import { loginApi } from './Api';
import { Button, Image } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import BackIcon from "../../assets/images/icons/backIcon.svg";
import DesktopImg from "../../assets/images/icons/desktop.svg";
import LochIcon from "../../assets/images/icons/grey-loch.svg";
import {
  MobileEmail,
  MobileEmailPageView,
  SmartMobileEmail,
} from "../../utils/AnalyticsFunctions";

class MobileDevice extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  componentDidMount() {
    MobileEmailPageView();
  }

  componentWillUnmount() {}

  handleSave = () => {
    if (this.props.isSmartMoney) {
      SmartMobileEmail({ email_address: this.state.email });
    }
    MobileEmail({ email_address: this.state.email });
    toast.success("Email added to our mailing list");

    this.setState({
      email: "",
    });

    // setTimeout(() => {
    //   this.props.history.push("/welcome");
    // }, 2000);
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          padding: "0 5%",
          flexDirection: "column",
          position: "relative",
        }}
        className="MobileComingSoon"
      >
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          // closeOnClick
          closeButton={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {!this.props.isSmartMoney ? (
          <Image
            src={BackIcon}
            style={{
              position: "absolute",
              top: "2rem",
              left: "2rem",
              width: "3rem",
            }}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "https://loch.one/";
            }}
          />
        ) : null}
        <Image src={LochIcon} style={{ position: "relative", top: "-8rem" }} />
        <div
          style={{
            background: "#FFFFFF",
            boxShadow:
              "0px 3.15493px 4.73239px -3.15493px rgba(24, 39, 75, 0.12), 0px 6.30986px 6.30986px -3.15493px rgba(24, 39, 75, 0.08)",
            borderRadius: "12px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Image src={DesktopImg} />
          <h3 className="inter-display-medium f-s-20 lh-24 m-t-20">
            Sorry! We are not built for <br />
            mobile just yet.
          </h3>
          <h4 className="inter-display-medium f-s-16 lh-19 grey-969 m-t-8">
            Come back on your desktop, laptop or tablet for the best Loch
            experience.
          </h4>
        </div>
        <h4 className="inter-display-medium f-s-16 lh-19 grey-969 m-t-20">
          Add your email so you can be the first to know when we’ve launched
          mobile for {this.props.isSmartMoney ? "Loch’s Leaderboard " : "Loch"}.
        </h4>
        <Form onValidSubmit={this.handleSave}>
          <FormElement
            valueLink={this.linkState(this, "email")}
            // label="Email Info"
            required
            validations={[
              {
                validate: FormValidator.isRequired,
                message: "",
              },
              {
                validate: FormValidator.isEmail,
                message: "Enter valid email",
              },
              // {
              //     validate: () => {
              //       console.log("state", this.state.isOptInValid);
              //        return !this.state.isOptInValid;
              //   },
              //     message:"invalid verification code"
              // }
            ]}
            control={{
              type: CustomTextControl,
              settings: {
                placeholder: "Your email address",
              },
            }}
            // className={"is-valid"}
          />
          <Button className={`btn primary-btn w-100`} type="submit">
            Get started
          </Button>
        </Form>
        {/* <Button
          className="btn primary-btn m-t-30 w-100"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "https://loch.one/";
          }}
        >
          Go home
        </Button> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MobileDevice);
