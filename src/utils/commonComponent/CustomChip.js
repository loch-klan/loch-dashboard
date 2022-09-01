import { Badge, Image } from "react-bootstrap";

function CustomChip({ coins }) {
    return (
        <div className="chip-container">
            {coins && coins.length > 1 ? <Badge title={coins.map(function (coin) {
                return coin.coinName;
            })} className="inter-display-medium f-s-13 lh-16 grey-313">
                +{coins.length}</Badge> :
                <Badge className="inter-display-medium f-s-13 lh-16 grey-313">
                    <Image src={coins[0].coinSymbol} />
                    {coins[0].coinName}</Badge>
            }
        </div >
    );
}

export default CustomChip;