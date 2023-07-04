import React, { Fragment } from "react";
import PropTypes from "prop-types";

class BaseReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getIn = (obj, path) => {
    // console.log('obj, path', obj, path);
    const stack = path.split(".");
    // console.log('stack', stack);
    let getElement = { ...obj };
    // console.log('getElement 1', getElement);
    while (stack.length) {
      getElement = getElement[stack.shift()];
    }
    // console.log('getElement', getElement);
    return getElement;
  };

  updateIn = (obj, path, value) => {
    // console.log('obj, path, value', obj, path, value);
    let current = obj;
    const stack = path.split(".");
    // console.log('stack', stack);
    while (stack.length > 1) {
      current = current[stack.shift()];
    }
    current[stack.shift()] = value;
    // console.log('obj', obj);
    return obj;
  };

  updateCb = (obj, path, position) => {
    // console.log('obj, path, position', obj, path, position);
    // console.log('obj.path', obj[path]);
    let current = obj;
    const stack = path.split(".");
    // console.log('stack', stack);
    while (stack.length > 1) {
      current = current[stack.shift()];
    }
    // console.log('current', current);
    // console.log('current[stack.shift()]', current[stack.shift()]);
    // let newCurrent = current[stack.shift()];
    let newCurrent = obj[path];
    // console.log('newCurrent', newCurrent);
    newCurrent.map((item, i) => {
      if (i === position) {
        return (item.key = !item.key);
      }
      return item;
    });
    return newCurrent;
  };

  linkState = (ctx, path, onUpdateCallback) =>
    // console.log('ctx, path, onUpdateCallback', ctx, path, onUpdateCallback),
    ({
      // todo : add type to handle type of input
      // also add preUpdateCallback if required.
      value: this.getIn(ctx.state, path),
      requestChange: (value, onSetCallback) =>
        ctx.setState(this.updateIn(ctx.state, path, value), () => {
          if (onUpdateCallback) {
            onUpdateCallback(value);
          }
          if (onSetCallback) {
            onSetCallback(value);
          }
        }),
      // value: this.getIn(ctx.state, path),
      requestCheckboxChange: (value, position, onSetCallback) =>
        ctx.setState(this.updateCb(ctx.state, path, position), () => {
          if (onUpdateCallback) {
            onUpdateCallback(value);
          }
          if (onSetCallback) {
            onSetCallback(value);
          }
        }),
    });

  render() {
    return <Fragment>{this.props.children}</Fragment>;
  }
}

BaseReactComponent.propTypes = {
  children: PropTypes.any,
};

BaseReactComponent.defaultProps = {
  children: null,
};

export default BaseReactComponent;
