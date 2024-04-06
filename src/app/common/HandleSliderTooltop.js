import Tooltip from "rc-tooltip";
import React from "react";
import raf from "rc-util/lib/raf";
const HandleTooltip = (props) => {
  const {
    value,
    children,
    visible,
    tipFormatter = (val) => `${val} %`,
    ...restProps
  } = props;

  const tooltipRef = React.useRef();
  const rafRef = React.useRef(null);

  function cancelKeepAlign() {
    //   raf.cancel(rafRef.current!);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forceAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: "auto" }}
      ref={tooltipRef}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

export default HandleTooltip;
