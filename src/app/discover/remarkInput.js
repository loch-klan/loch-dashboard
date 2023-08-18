import React from "react";
import Form from "../../utils/form/Form";
import { CustomTextControl, FormElement } from "../../utils/form";
import BaseReactComponent from "./../../utils/form/BaseReactComponent";
class RemarkInput extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      remark: props?.remark || "",
    };
  }

  onSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.remark);
    }
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="remarkInput"
      >
        <Form onValidSubmit={this.onSubmit}>
          <FormElement
            valueLink={this.linkState(this, "remark")}
            required
            control={{
              type: CustomTextControl,
              settings: {
                placeholder: "What do you think of this address?",
              },
            }}
          />
        </Form>
      </div>
    );
  }
}

export default RemarkInput;
