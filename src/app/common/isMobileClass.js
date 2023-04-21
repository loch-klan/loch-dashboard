import React, { Component } from "react";

class IsMobileClass extends Component {
  constructor(props) {
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
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    console.log("resize event fired"); // <-- add this line

    const mediaQuery = window.matchMedia("(max-width: 480px)");
    this.setState({ isMobile: mediaQuery.matches });
    console.log(mediaQuery.matches); // <-- add this line
  };

  render() {
    return this.state.isMobile;
  }
}

export default IsMobileClass;
