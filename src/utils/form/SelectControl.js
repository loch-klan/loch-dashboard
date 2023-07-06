import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Select from "react-select";

const SelectControl = (props) => {
  // console.log('props', props);
  const {
    onBlur,
    valueLink,
    options,
    multiple,
    searchable,
    placeholder,
    closeMenuOnSelect,
    menuIsOpen,
    noOptionCustom = () =>
      noOptionAction ? (
        <div className="btn black-btn" onClick={noOptionAction}>
          Add New Customer
        </div>
      ) : (
        <div>No Options</div>
      ),
    noOptionAction = null,
    onChangeCallback = () => {},
    disabled = false,
    failedValidation,
  } = props;

  const optionsDict = _.keyBy(options, "value");
  const stateValue = valueLink.value;
  let valueOption = "";
  if (multiple && stateValue.length > 0) {
    valueOption = stateValue.map((value) => optionsDict[value]);
  }
  if (!multiple && stateValue) {
    valueOption = optionsDict[stateValue];
  }

  const onChangeInternal = (selectedOption) => {
    if (multiple) {
      valueLink.requestChange(selectedOption.map((option) => option.value));
      // onBlur(stateValue);
      // ON BLUR METHOD IS REMOVED AND INSTED PASSED AS CALLBACK METHOD.
      onChangeCallback(onBlur);
    } else {
      valueLink.requestChange(selectedOption ? selectedOption.value : "");
      // onBlur(stateValue);
      // ON BLUR METHOD IS REMOVED AND INSTED PASSED AS CALLBACK METHOD.
      onChangeCallback(onBlur);
    }
  };

  return (
    <Select
      menuIsOpen={menuIsOpen}
      closeMenuOnSelect={closeMenuOnSelect}
      isMulti={multiple}
      value={valueOption}
      onChange={onChangeInternal}
      // onBlur={onBlur}
      simpleValue={false}
      options={options}
      isClearable={false}
      isSearchable={searchable}
      isDisabled={disabled}
      // filterOptions={filterOptions}
      // filterOptions={customFilterOption}
      placeholder={placeholder}
      noOptionsMessage={noOptionCustom}
      classNamePrefix={`custom-select`}
      className={`${
        failedValidation && failedValidation.message ? "has-error" : ""
      }`}
    />
  );
};

SelectControl.propTypes = {
  // classes: PropTypes.object.isRequired,
  onBlur: PropTypes.func.isRequired,
  valueLink: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
};

SelectControl.defaultProps = {
  multiple: false,
  placeholder: "Select Values",
};

export default SelectControl;
