import { BaseReactComponent } from "../../../../../../utils/form";
import "./_backTestWeightBuilderBlock.scss";

class BackTestWeightBuilderBlock extends BaseReactComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <div className="sbb-content">
          <div className="back-test-weight-builder">
            <div>Equal</div>
          </div>
        </div>
      </>
    );
  }
}

export default BackTestWeightBuilderBlock;
