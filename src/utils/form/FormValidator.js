/* eslint-disable */ // TO DISABLE ESLINT FOR THIS FILE.
import _ from "lodash";

export default class FormValidator {
  static isRequired = (value) => {
    if (_.isArray(value)) {
      return value.length !== 0;
    }

    if (_.isString(value)) {
      return value?.trim().length !== 0;
    }

    if (_.isNull(value) || _.isUndefined(value)) {
      return false;
    }

    return true;
  };

  static isEqual = (referenceValue) => (value) => referenceValue === value;

  static matchRegex = (regex) => (value) => regex.test(value);

  static hasMinLength = (min) => (value) =>
    _.isArray(value) || _.isString(value) ? value.length >= min : false;

  static hasMaxLength = (max) => (value) =>
    _.isArray(value) || _.isString(value) ? value.length <= max : false;

  static isWithinLength = (min, max) => (value) =>
    _.isArray(value) || _.isString(value)
      ? value.length >= min && value.length <= max
      : false;

  static contains = (seed) => (value) =>
    _.isArray(value) || _.isString(value) ? value.indexOf(seed) !== -1 : false;

  static isString = (value) => _.isString(value);

  static isEmail = (value) =>
    FormValidator.matchRegex(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    )(value);

  // for numbers followed by letters. eg: 2234ADdsdsAD
  static isSceneNumber = (value) =>
    FormValidator.matchRegex(/^[0-9]+[a-zA-Z]*$/)(value);

  static isEmailOptional = (value) => {
    if (value !== null && value.length > 1) {
      let isEmail;
      isEmail = FormValidator.matchRegex(
        /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      )(value);
      return isEmail;
    } else {
      return true;
    }
  };

  static isLetter = (value) => FormValidator.matchRegex(/^[a-zA-Z]*$/i)(value);

  static isLetterAndSpecial = (value) =>
    FormValidator.matchRegex(/^[a-zA-Z!@#$%&*()\-_=+\^\s]*$/)(value);

  static isInt = (value) => _.isInteger(parseInt(value, 10));

  static isNum = (value) => FormValidator.matchRegex(/^\d+$/)(value);

  static isPositiveInt = (value) => {
    if (value) {
      FormValidator.isInt(value) && value > 0;
    } else {
      return true;
    }
  };

  static isWithinInt = (min, max) => (value) =>
    FormValidator.isInt(value) && value >= min && value <= max;

  static isNumeric = (precision, scale) => (value) => {
    const highestNumber = 10 ** (precision - scale) - 10 ** -scale;
    return value >= -highestNumber && value <= highestNumber;
  };

  static isDecimalTwo = (value) =>
    FormValidator.matchRegex(/^[0-9]+([.][0-9]{0,2})?$/)(value);

  static isPostiveNumeric = (precision, scale) => (value) =>
    FormValidator.isNumeric(precision, scale)(value) && value > 0;

  static isWithinNumeric = (precision, scale, min, max) => (value) =>
    FormValidator.isNumeric(precision, scale)(value) &&
    value >= min &&
    value <= max;

  static isLowercase = (value) => FormValidator.matchRegex(/^[a-z]*$/)(value);

  static isUppercase = (value) => FormValidator.matchRegex(/^[A-Z]*$/)(value);

  static isPassword =
    (
      requireSmallLetter = true,
      requireCapitalLetter = true,
      requireNumber = true,
      requireSpecialCharacter = true
    ) =>
    (value) => {
      let passwordValidity = true;
      if (requireSmallLetter && passwordValidity) {
        passwordValidity = FormValidator.matchRegex(/[a-z]+/)(value);
      }
      if (requireCapitalLetter && passwordValidity) {
        passwordValidity = FormValidator.matchRegex(/[A-Z]+/)(value);
      }
      if (requireNumber && passwordValidity) {
        passwordValidity = FormValidator.matchRegex(/[0-9]+/)(value);
      }
      if (requireSpecialCharacter && passwordValidity) {
        passwordValidity = FormValidator.matchRegex(/[!@#$%^&*_]+/)(value);
      }
      return passwordValidity;
    };

  static isPhone = (value) =>
    FormValidator.matchRegex(/^\+?([0-9-]){10,10}$/)(value);
}
