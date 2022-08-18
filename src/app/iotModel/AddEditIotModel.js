import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import { BaseReactComponent, CustomTextControl, Form, FormElement, FormValidator } from '../../utils/form';
import { ComponentHeader } from '../common';
import ReactDOM from 'react-dom';
import { addUpdateIotModelApi } from './Api';

class AddEditIotModel extends BaseReactComponent {
  constructor(props) {
    super(props);
    const editData = props.location.state ? props.location.state.editData : {};
    this.state = {
      editId: editData.id || "",
      modelName: editData.modelName || "",
      manufacturerName: editData.modelCompany || "",
    }
  }
  componentDidMount() { }
  handleSave = () => {
    ReactDOM.findDOMNode(this.form).dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
  }

  onValidSubmit = () => {
    const data = new URLSearchParams();
    data.append("model_name", this.state.modelName);
    data.append("model_company", this.state.manufacturerName);
    if (this.state.editId) {
      data.append("model_id", this.state.editId);
    }
    addUpdateIotModelApi(data, () => {
      this.props.history.push('/master/Iot-models');
    })
  }

  render() {
    return (
      <>
        <ComponentHeader
          backArrowBtn={true}
          history={this.props.history}
          title={`${this.state.editId ? "Edit" : "Add"} Iot Model`}
          secondaryBtnText={"Cancel"}
          isSecondaryBtn={() => this.props.history.goBack()}
          isPrimaryBtn={this.handleSave}
          primaryBtnText={"Save Iot Model"}
        />
        <div className="add-edit-customer-wrapper">
          {/* <Container> */}
          <div className="content">
            <Form onValidSubmit={this.onValidSubmit} ref={el => this.form = el}>
              <Row>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "modelName")}
                    label="Model Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Model name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Model Name",
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <FormElement
                    valueLink={this.linkState(this, "manufacturerName")}
                    label="Manufacturer Name"
                    required
                    validations={[
                      {
                        validate: FormValidator.isRequired,
                        message: "Manufacturer name cannot be empty"
                      },
                    ]}
                    control={{
                      type: CustomTextControl,
                      settings: {
                        placeholder: "Enter Manufacturer Name",
                      }
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </div>
          {/* </Container> */}
        </div>
      </>
    )
  }
}
const mapStateToProps = state => ({
  ...state
});
const mapDispatchToProps = {
  // getPosts: fetchPosts
}
export default connect(mapStateToProps, mapDispatchToProps)(AddEditIotModel);