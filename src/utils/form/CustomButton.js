import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Image } from "react-bootstrap";
import { loadingAnimation } from "../ReusableFunctions";

const CustomButton = (props) => {
  const {
    isActive,
    isLoading = null,
    isBlock,
    isDisabled,
    href,
    variant,
    handleClick,
    type,
    buttonText,
    buttonImage,
    className = "",
    buttonAttachedImage,
  } = props;
  return (
    <Button
      type={type}
      variant={variant}
      block={isBlock}
      active={isActive}
      disabled={isDisabled}
      href={href}
      onClick={handleClick}
      className={className}
    >
      {isLoading
        ? loadingAnimation()
        : (
            <>
              {buttonText}
              {buttonAttachedImage ? (
                <Image
                  className="buttonAttachedImageCutomBtn"
                  src={buttonAttachedImage}
                />
              ) : null}
            </>
          ) || <Image src={buttonImage} />}
    </Button>
  );
};

CustomButton.propTypes = {
  type: PropTypes.string,
  variant: PropTypes.string,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  isBlock: PropTypes.bool,
  href: PropTypes.string,
  handleClick: PropTypes.func,
  buttonText: PropTypes.string,
  className: PropTypes.string,
  // valueLink: PropTypes.object.isRequired,
};

CustomButton.defaultProps = {
  type: "button",
  variant: "primary",
  isDisabled: false,
  isActive: false,
};

export default CustomButton;
