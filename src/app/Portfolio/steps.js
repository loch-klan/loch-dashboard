import React, { Component } from 'react'
import { Image } from 'react-bootstrap';
import StarIcon from "../../assets/images/icons/Star-steps.svg"
import Slider from "react-slick";
import prevIcon from "../../assets/images/icons/prev-arrow.svg";
import nextIcon from "../../assets/images/icons/next-arrow.svg";
import ArrowRight from "../../assets/images/icons/arrow-right.svg";
import AddWallet from "../../assets/images/add-wallet-step.png"
import Nickname from "../../assets/images/add-wallet-step.png";
import MultiAddWallet from "../../assets/images/add-wallet-step.png";
import ConnectExchange from "../../assets/images/add-wallet-step.png";
import MultiConnectExchange from "../../assets/images/add-wallet-step.png";
import WhalePod from "../../assets/images/add-wallet-step.png";

class Steps extends Component {
  constructor(props) {
     const settings = {
       dots: false,
       infinite: false,
       speed: 500,
       slidesToShow: 2.85,
       slidesToScroll: 1,
       nextArrow: <Image src={nextIcon} />,
       prevArrow: <Image src={prevIcon} />,
     };
    super(props);
     this.state = {
       settings,
     };
  }
  render() {
    return (
      <div className="step-wrapper">
        <div className="top-header">
          <div className="section-title">
            <Image src={StarIcon} />
            <h4 className="inter-display-medium f-s-20 lh-24 m-l-10">
              Be an expert at Loch
            </h4>

            <h5 className="inter-display-medium f-s-13 lh-15 m-l-8 green-color">
              5 steps
            </h5>
            <h5 className="inter-display-medium f-s-13 lh-15 m-l-4 grey-B0B">
              out of 10 steps
            </h5>
          </div>
          <h5 className="inter-display-medium f-s-16 lh-19 green-color">50%</h5>
        </div>
        <div className="progress-bar">
          <div className="color-line"></div>
        </div>
        <div className="step-slider-wrapper">
          <Slider {...this.state.settings}>
            <div>
              <div className="step-card">
                <div className="card-icon m-r-12">
                  <Image src={AddWallet} />
                </div>
                <div className="card-content m-r-20">
                  <h5 className="inter-display-medium f-s-16 lh-19">
                    Add a wallet address
                  </h5>
                  <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                    Start with a wallet address
                  </h5>
                </div>
                <div className="go-btn">
                  <h6 className="inter-display-semi-bold f-s-13 lh-15 m-r-5">
                    Go
                  </h6>
                  <Image src={ArrowRight} />
                </div>
              </div>
            </div>
            <div>
              <div className="step-card">
                <div className="card-icon m-r-12">
                  <Image src={AddWallet} />
                </div>
                <div className="card-content m-r-20">
                  <h5 className="inter-display-medium f-s-16 lh-19">
                    Add a nickname
                  </h5>
                  <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                    Organise your address
                  </h5>
                </div>
                <div className="go-btn">
                  <h6 className="inter-display-semi-bold f-s-13 lh-15 m-r-5">
                    Go
                  </h6>
                  <Image src={ArrowRight} />
                </div>
              </div>
            </div>
            <div>
              <div className="step-card">
                <div className="card-icon m-r-12">
                  <Image src={AddWallet} />
                </div>
                <div className="card-content m-r-20">
                  <h5 className="inter-display-medium f-s-16 lh-19">
                    Add multiple wallet address
                  </h5>
                  <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                    Add more wallets
                  </h5>
                </div>
                <div className="go-btn">
                  <h6 className="inter-display-semi-bold f-s-13 lh-15 m-r-5">
                    Go
                  </h6>
                  <Image src={ArrowRight} />
                </div>
              </div>
            </div>
            <div>
              <div className="step-card">
                <div className="card-icon m-r-12">
                  <Image src={AddWallet} />
                </div>
                <div className="card-content m-r-20">
                  <h5 className="inter-display-medium f-s-16 lh-19">
                    Connected 1 exchange
                  </h5>
                  <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                    Start with an exchange
                  </h5>
                </div>
                <div className="go-btn">
                  <h6 className="inter-display-semi-bold f-s-13 lh-15 m-r-5">
                    Go
                  </h6>
                  <Image src={ArrowRight} />
                </div>
              </div>
            </div>
            <div>
              <div className="step-card">
                <div className="card-icon m-r-12">
                  <Image src={AddWallet} />
                </div>
                <div className="card-content m-r-20">
                  <h5 className="inter-display-medium f-s-16 lh-19">
                    Connected multiple exchanges
                  </h5>
                  <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                    Add more exchanges
                  </h5>
                </div>
                <div className="go-btn">
                  <h6 className="inter-display-semi-bold f-s-13 lh-15 m-r-5">
                    Go
                  </h6>
                  <Image src={ArrowRight} />
                </div>
              </div>
            </div>
            <div>
              <div className="step-card">
                <div className="card-icon m-r-12">
                  <Image src={AddWallet} />
                </div>
                <div className="card-content m-r-20">
                  <h5 className="inter-display-medium f-s-16 lh-19">
                    Added one whale pod
                  </h5>
                  <h5 className="inter-display-medium f-s-13 lh-15 grey-969">
                    Start with a whale pod
                  </h5>
                </div>
                <div className="go-btn">
                  <h6 className="inter-display-semi-bold f-s-13 lh-15 m-r-5">
                    Go
                  </h6>
                  <Image src={ArrowRight} />
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}
export default Steps