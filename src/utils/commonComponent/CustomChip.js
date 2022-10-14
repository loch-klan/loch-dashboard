import { Badge, Image } from "react-bootstrap";
import CustomOverlay from "./CustomOverlay";
import unrecognised from '../../image/unrecognised.png';

function CustomChip({ coins, isLoaded }) {
    let sortedCoins = coins ? coins.sort((a, b) => a.coinName - b.coinName) : null;
    return (
        <>
            {
                isLoaded ?
                    sortedCoins
                        ?
                        sortedCoins.length > 1
                            ?
                            <div className="chip-wrapper">
                                <div className="chip-container-dual">
                                <Image src={sortedCoins[0].coinSymbol} />
                                    <Badge className="inter-display-medium f-s-13 lh-16 grey-313">
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
                                <Image src={sortedCoins[0].coinSymbol} />
                                    <Badge className="inter-display-medium f-s-13 lh-16 grey-313">
                                        {sortedCoins[0].coinName}</Badge>
                                </div>
                            </div>
                        :
                        <div className="chip-wrapper">
                            <div className="chip-container">
                            <Image src={unrecognised} className="unrecognised" />
                                <Badge className="inter-display-medium f-s-13 lh-16 grey-313">Unrecognized</Badge>
                            </div>
                        </div>
                    :
                    <div className="chip-wrapper">
                        <div className="spinner-chip-container">
                            <div className="spinner">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default CustomChip;