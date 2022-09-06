import { Badge, Image } from "react-bootstrap";
import CustomOverlay from "./CustomOverlay";
import unrecognised from '../../image/unrecognised.png';

function CustomChip({ coins }) {
    let sortedCoins = coins ? coins.sort((a, b) => a.coinName - b.coinName) : null;
    return (
        <>
            {
              sortedCoins
                ?
                sortedCoins.length > 1
                ?
                <div className="chip-wrapper">
                  <div className="chip-container-dual">
                      <Badge className="inter-display-medium f-s-13 lh-16 grey-313">
                          <Image src={sortedCoins[0].coinSymbol} />
                          {sortedCoins[0].coinName}</Badge>
                  </div>
                  <div className="chip-container">
                      <CustomOverlay
                          text={sortedCoins}
                          position="top"
                      >
                          <Badge className="inter-display-medium f-s-13 lh-16 grey-313">+{sortedCoins.length - 1}</Badge>
                      </CustomOverlay>
                  </div>
                </div>
                :
                <div className="chip-wrapper">
                  <div className="chip-container">
                      <Badge className="inter-display-medium f-s-13 lh-16 grey-313">
                          <Image src={sortedCoins[0].coinSymbol} />
                          {sortedCoins[0].coinName}</Badge>
                  </div>
                </div>
              :
              <div className="chip-wrapper">
                <div className="chip-container">
                  <Badge className="inter-display-medium f-s-13 lh-16 grey-313"> <Image src={unrecognised} className="unrecognised" /> Unrecognised wallet</Badge>
                </div>
              </div>

            }
        </>
    );
}

export default CustomChip;