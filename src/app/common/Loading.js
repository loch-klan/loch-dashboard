import React, { useState } from "react";
import lochClean from "../../assets/images/LochClean.gif";
import { Image } from "react-bootstrap";

function Loading(props) {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const logoLoadingComplete = () => {
    setIsLogoLoaded(true);
  };
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 1500,
    arrows: false,
    vertical: true,
    className: "slider variable-width",
  };
  return (
    <div className="loading-animation">
      <Image
        style={{
          opacity: isLogoLoaded ? 1 : 0,
        }}
        onLoad={logoLoadingComplete}
        src={lochClean}
        className="no-data"
      />

      {/* {!props.showIcon && (
        <>
          <div className="slick-text">
            <span>Indexing blockchains is </span>
            <div className="slick-slider">
              <Slider {...settings}>
                <div>
                  <h3>cumbersome</h3>
                </div>
                <div style={{ width: 1000 }}>
                  <h3>time consuming</h3>
                </div>
                <div>
                  <h3>intricate</h3>
                </div>
              </Slider>
            </div>
          </div>
          <span className="slick-text">Hang On. We got you.</span>
        </>
      )} */}
    </div>
  );
}

export default Loading;
