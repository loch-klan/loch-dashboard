import React from "react";
import { Image, Button } from "react-bootstrap";
import greenTick from "../../assets/images/icons/greenCIrcleTick.svg";
import { MEDIA_URL, OrderStatus } from "../../utils/Constant";

const EstimatedFare = (props) => {
  const {
    pricing,
    discountAmount,
    pointsApplied,
    points,
    duration,
    isViewBooking = false,
    extensionInfo = null,
    cancellationFee = "",
    extraCharges = "",
    status,
  } = props;

  let returnOrOutstanding =
    pricing.deposit -
    extraCharges?.total_penalty_amount -
    extraCharges?.damage_amount -
    extraCharges?.damage_tax_amount;
  console.log(status);

  return (
    <div className="estimated-fare-wrapper">
      <div className="fare">
        <h3 className="proximanova-bold f-s-20 lh-26">Total Fare & Penalty</h3>
        <h3 className="proximanova-bold f-s-20 lh-26">
          ₹{pricing.total_amount}
        </h3>
      </div>
      <div className="fare">
        <p className="proximanova-regular f-s-14 lh-21 op-6">
          About {pricing.allowed_kms} free kms, {duration}
        </p>
        <p className="proximanova-regular f-s-14 lh-21 op-6">
          {isViewBooking ? (
            <span>
              {" "}
              <Image src={greenTick} />
              Paid
            </span>
          ) : (
            "To Pay"
          )}
        </p>
      </div>
      <hr />
      <div className="fare">
        <h4 className="proximanova-medium f-s-16 lh-24">Booking Tariff</h4>
        <h4 className="proximanova-bold f-s-16 lh-24">
          ₹{pricing.booking_price}
        </h4>
      </div>
      <div className="fare">
        <h4 className="proximanova-medium f-s-14 lh-22 op-87">Base Fare</h4>
        <h4 className="proximanova-medium f-s-14 lh-22 op-87">
          ₹{pricing.price}
        </h4>
      </div>
      {discountAmount && discountAmount > 0 && (
        <div className="fare">
          <h4 className="proximanova-medium f-s-14 lh-22 op-87">
            Coupon applied
          </h4>
          <h4 className="proximanova-medium f-s-14 lh-22 op-87">
            - ₹{discountAmount}
          </h4>
        </div>
      )}
      {pointsApplied && (
        <div className="fare">
          <h4 className="proximanova-medium f-s-14 lh-22 op-87">
            Points balance
          </h4>
          <h4 className="proximanova-medium f-s-14 lh-22 op-87">- ₹{points}</h4>
        </div>
      )}
      <div className="fare">
        <h4 className="proximanova-medium f-s-14 lh-22 op-87">GST</h4>
        <h4 className="proximanova-medium f-s-14 lh-22 op-87">
          ₹{pricing.total_tax_amount}
        </h4>
      </div>
      {cancellationFee > 0 && (
        <div className="fare" style={{ alignItems: "baseline" }}>
          <h4 className="proximanova-medium f-s-16 lh-24">
            Cancellation Fee{" "}
            <span className="proximanova-regular f-s-12 lh-20 op-6">
              (with tax)
            </span>{" "}
          </h4>
          <h4 className="proximanova-bold f-s-16 lh-24">₹{cancellationFee}</h4>
        </div>
      )}
      {extensionInfo && (
        <div className="fare" style={{ alignItems: "baseline" }}>
          <h4 className="proximanova-medium f-s-16 lh-24">
            Extension Fee{" "}
            <p className="proximanova-regular f-s-12 lh-20 op-6">
              Extra {extensionInfo.allowed_kms} kms,{" "}
              {extensionInfo.booking_time} hrs
            </p>{" "}
          </h4>
          <h4 className="proximanova-bold f-s-16 lh-24">
            ₹{extensionInfo.total_amount}
          </h4>
        </div>
      )}
      {extraCharges && extraCharges.total_penalty_amount > 0 && (
        <div className="fare">
          <h4 className="proximanova-medium f-s-16 lh-24">Penalty Fee </h4>
          <h4 className="proximanova-bold f-s-16 lh-24">
            ₹{extraCharges.total_penalty_amount}
          </h4>
        </div>
      )}
      {extraCharges && extraCharges.damage_amount > 0 && (
        <div className="fare">
          <h4 className="proximanova-medium f-s-16 lh-24">Damage Fee </h4>
          <h4 className="proximanova-bold f-s-16 lh-24">
            ₹{extraCharges.damage_amount + extraCharges.damage_tax_amount}
          </h4>
        </div>
      )}
      <div className="fare">
        <h4 className="proximanova-medium f-s-16 lh-24">Deposit</h4>
        <h4 className="proximanova-bold f-s-16 lh-24">₹{pricing.deposit}</h4>
      </div>

      {/* <div className="fare">
        <h4 className='proximanova-medium f-s-16 lh-24'>{returnOrOutstanding > 0 ? "Refund Amount" : "Outstanding Amount"}</h4>
        <h4 className='proximanova-bold f-s-16 lh-24'>₹{returnOrOutstanding}</h4>
      </div> */}
      {status >= OrderStatus.PICKED_UP &&
        status <= OrderStatus.RETURN_PAYMENT_PENDING && (
          <>
            <hr />
            <div className="penalty-btn">
              <Button
                className="btn secondary-btn"
                onClick={props.handleAddPenaltyModal}
              >
                + Add Penalty
              </Button>
            </div>
          </>
        )}

      {extraCharges &&
        extraCharges.damage_attachments &&
        extraCharges.damage_attachments.length > 0 && (
          <>
            <br />
            <h4 className="proximanova-medium f-s-16 lh-24">Damage Images</h4>
            <div className="damage-images">
              {extraCharges.damage_attachments.map((item) => {
                return <Image src={MEDIA_URL + item.path} className="" />;
              })}
            </div>
          </>
        )}
      {/* <p className='proximanova-regular f-s-16 lh-24'>₹{pricing.penalty_price_per_hour}/hr will be charged for additional hours</p>
      <p className='proximanova-regular f-s-16 lh-24'>₹{pricing.per_km_price}/kms will be charged for extra kms</p> */}
    </div>
  );
};
EstimatedFare.propTypes = {
  // getPosts: PropTypes.func
};
export default EstimatedFare;
