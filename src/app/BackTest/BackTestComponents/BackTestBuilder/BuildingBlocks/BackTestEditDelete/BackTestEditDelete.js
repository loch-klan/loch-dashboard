import { Image } from "react-bootstrap";
import { BaseReactComponent } from "../../../../../../utils/form";
import "./_backTestEditDelete.scss";
import {
  StrategyBuilderDeleteIcon,
  StrategyBuilderPencilIcon,
  StrategyBuilderAddIcon,
} from "../../../../../../assets/images/icons";
import { mobileCheck } from "../../../../../../utils/ReusableFunctions";

class BackTestEditDelete extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: mobileCheck(),
    };
  }

  render() {
    return (
      <div
        className={`sbb-edit-delete-options ${
          this.state.isMobile ? "sbb-edit-delete-options-mobile" : ""
        }`}
      >
        {this.props.hideEditBtn ? null : (
          <div
            onClick={this.props.onEditClick}
            className="sbb-edit-delete-options-block sbb-edit-delete-options-edit"
          >
            <Image
              className="sbb-edit-delete-options-block-image sbb-edit-delete-options-edit-image"
              src={StrategyBuilderPencilIcon}
            />
          </div>
        )}
        {this.props.hideDeleteBtn ? null : (
          <div
            onClick={this.props.onDeleteClick}
            className="sbb-edit-delete-options-block sbb-edit-delete-options-delete"
          >
            <Image
              className="sbb-edit-delete-options-block-image sbb-edit-delete-options-delete-image"
              src={StrategyBuilderDeleteIcon}
            />
          </div>
        )}
        {this.props.hideAddBtn ? null : (
          <div
            onClick={this.props.onAddClick}
            className="sbb-edit-delete-options-block "
          >
            <Image
              className="sbb-edit-delete-options-block-image sbb-edit-delete-options-edit-image"
              src={StrategyBuilderAddIcon}
            />
          </div>
        )}
      </div>
    );
  }
}

export default BackTestEditDelete;
