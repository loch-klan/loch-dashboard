import React from "react";
import { BaseReactComponent } from "../../utils/form";

class IsMobileClass extends React.Component {
  constructor(props) {
    console.log("constructio");
    super(props);

    this.state = {
      isMobile: false,
    };
  }

  componentDidMount() {
    console.log("component mounted"); // <-- add this line

    const mediaQuery = window.matchMedia("(max-width: 480px)");
    this.setState({ isMobile: mediaQuery.matches });
    console.log(mediaQuery.matches); // <-- add this line

    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    console.log("resize event fired will"); // <-- add this linen

    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    console.log("resize event fired"); // <-- add this line

    const mediaQuery = window.matchMedia("(max-width: 480px)");
    this.setState({ isMobile: mediaQuery.matches });
    console.log(mediaQuery.matches); // <-- add this line
  };

  render() {
    console.log("IsMobile rendered");
    return this.state.isMobile;
  }
}

export default IsMobileClass;
