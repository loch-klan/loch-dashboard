import React from "react";

import { BaseReactComponent } from "../../utils/form";
import { ClockGreyIcon } from "../../assets/images/icons";
import moment from "moment";
import { TruncateText } from "../../utils/ReusableFunctions";

class TransactionFeedBlock extends BaseReactComponent {
  constructor(props) {
    super(props);

    this.state = {
      feedListData: {
        from: undefined,
        to: undefined,
        amountUSD: undefined,
        amountCoin: undefined,
        coinName: undefined,
        dateAndTime: undefined,
        coinIcon: undefined,
        fromName: "",
        toName: "",
      },
    };
  }
  componentDidMount() {
    if (this.props.feedListData) {
      let tempFrom = "";
      let tempTo = "";

      const tempFromHolder = this.props.feedListData.from;
      if (tempFromHolder.tag) {
        tempFrom = tempFromHolder.tag;
      } else if (tempFromHolder.ens) {
        tempFrom = tempFromHolder.ens;
      } else if (tempFromHolder.address) {
        tempFrom = TruncateText(tempFromHolder.address);
      }

      const tempToHolder = this.props.feedListData.to;
      if (tempToHolder.tag) {
        tempTo = tempToHolder.tag;
      } else if (tempToHolder.ens) {
        tempTo = tempToHolder.ens;
      } else if (tempToHolder.address) {
        tempTo = TruncateText(tempToHolder.address);
      }
      this.setState({
        feedListData: {
          ...this.props.feedListData,
          fromName: tempFrom,
          toName: tempTo,
        },
      });
    }
  }

  render() {
    const {
      fromName,
      toName,
      amountUSD,
      amountCoin,
      coinName,
      dateAndTime,
      coinIcon,
    } = this.state.feedListData;
    return (
      <div className="transactionFeedBlockContainer">
        <div className="transactionFeedBlock">
          <img
            alt="transactionFeedBlockIcon"
            className="transactionFeedBlockIcon"
            src={coinIcon}
          />
          <div className="transactionFeedBlockData">
            <span className="inter-display-medium f-s-16 black-191 underlineText">
              {fromName}
            </span>

            <span className="leftRightMargin inter-display-medium f-s-14 grey-B0B">
              transferred
            </span>
            <span className="inter-display-medium f-s-16 black-191 transactionFeedBlockAmount">
              ${amountUSD}
            </span>
            <span className="leftRightMargin inter-display-medium f-s-14 grey-B0B">
              or
            </span>
            <span className="inter-display-medium f-s-16 black-191 transactionFeedBlockAmount">
              {amountCoin} {coinName}
            </span>
            <span className="leftRightMargin inter-display-medium f-s-14 grey-B0B">
              to
            </span>
            <span className="inter-display-medium f-s-16 black-191 underlineText">
              {toName}
            </span>
          </div>
        </div>

        <div className="transactionFeedBlockTime">
          <img
            alt="transactionFeedClockIcon"
            className="transactionFeedClockIcon"
            src={ClockGreyIcon}
          />
          <p className="transactionFeedDate inter-display-medium f-s-12 grey-B0B">
            {moment(dateAndTime).format("DD/MM/YY")}
          </p>
          <p className="inter-display-medium f-s-12 grey-B0B">
            {moment(dateAndTime).format("h:mm")}
          </p>
        </div>
      </div>
    );
  }
}

export default TransactionFeedBlock;
