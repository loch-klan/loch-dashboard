import { Badge, Image } from "react-bootstrap";
import CustomOverlay from "./CustomOverlay";
import { lightenDarkenColor, loadingAnimation } from "../ReusableFunctions";

function CustomChip({ coins, isLoaded, id, isCohort }) {
  // console.log("coins", coins);
  if (isCohort) {
    coins = coins?.map((e) => {
      return {
        chain_detected: true,
        coinCode: e.code,
        coinName: e.name,
        coinColor: e.color,
        coinSymbol: e.symbol,
      };
    });
  }

  let sortedCoins = coins
    ? coins.sort((a, b) => a.coinName - b.coinName)
    : null;
  return (
    <>
      {isLoaded ? (
        sortedCoins ? (
          sortedCoins.length > 1 ? (
            <div
              className="chip-wrapper chipBottomwrapper"
              id={id}
              style={isCohort ? { position: "static" } : {}}
            >
              <div className="chip-container-dual">
                <Image
                  src={sortedCoins[0]?.coinSymbol}
                  style={{
                    border: `1px solid ${lightenDarkenColor(
                      sortedCoins[0]?.coinColor,
                      -0.15
                    )}`,
                    backgroundColor: sortedCoins[0]?.coinColor,
                  }}
                />
                <Badge className="inter-display-medium f-s-13 lh-13 grey-313">
                  {sortedCoins[0]?.coinName}
                </Badge>
              </div>
              <div className="chip-container">
                <CustomOverlay text={sortedCoins} position="top">
                  <Badge className="inter-display-medium f-s-13 lh-13 grey-313">
                    +{sortedCoins.length - 1}
                  </Badge>
                </CustomOverlay>
              </div>
            </div>
          ) : (
            <div
              className="chip-wrapper"
              id={id}
              style={isCohort ? { position: "static" } : {}}
            >
              <div className="chip-container">
                <Image
                  src={sortedCoins[0]?.coinSymbol}
                  style={{
                    border: `1px solid ${lightenDarkenColor(
                      sortedCoins[0]?.coinColor,
                      -0.15
                    )} `,
                    backgroundColor: sortedCoins[0]?.coinColor,
                  }}
                />
                <Badge className="inter-display-medium f-s-13 lh-13 grey-313">
                  {sortedCoins[0]?.coinName}
                </Badge>
              </div>
            </div>
          )
        ) : (
          <div
            className="chip-wrapper"
            id={id}
            style={isCohort ? { position: "static" } : {}}
          >
            {/* <div className="chip-container">
                            <Image src={unrecognized} className="unrecognized" style={{border: `1px solid ${lightenDarkenColor("#CACBCC",-0.15)} `}} />
                                <Badge className="inter-display-medium f-s-13 lh-16 grey-313">Unrecognized</Badge>
                            </div> */}
          </div>
        )
      ) : (
        <div
          className="chip-wrapper"
          id={id}
          style={isCohort ? { position: "static" } : {}}
        >
          {/* <div className="spinner-chip-container">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div> */}
          {loadingAnimation()}
        </div>
      )}
    </>
  );
}

export default CustomChip;
