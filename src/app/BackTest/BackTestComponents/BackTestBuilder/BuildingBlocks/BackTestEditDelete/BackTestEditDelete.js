import { Image } from "react-bootstrap";
import { BaseReactComponent } from "../../../../../../utils/form";
import "./_backTestEditDelete.scss";
import {
  StrategyBuilderDeleteIcon,
  StrategyBuilderPencilIcon,
} from "../../../../../../assets/images/icons";

class BackTestEditDelete extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={`sbb-edit-delete-options`}>
        <div
          onClick={this.props.onEditClick}
          className="sbb-edit-delete-options-block sbb-edit-delete-options-edit"
        >
          <Image
            className="sbb-edit-delete-options-block-image sbb-edit-delete-options-edit-image"
            src={StrategyBuilderPencilIcon}
          />
        </div>
        <div
          onClick={this.props.onDeleteClick}
          className="sbb-edit-delete-options-block sbb-edit-delete-options-delete"
        >
          <Image
            className="sbb-edit-delete-options-block-image sbb-edit-delete-options-delete-image"
            src={StrategyBuilderDeleteIcon}
          />
        </div>
      </div>
    );
  }
}

export default BackTestEditDelete;
