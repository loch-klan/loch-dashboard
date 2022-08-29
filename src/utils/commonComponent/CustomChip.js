import { Badge, Image } from "react-bootstrap";

function CustomChip({ coinText, isIcon, coinImage, count, children }) {
    return (
        <div className="chip-container">
            <Badge className="inter-display-medium f-s-13 lh-16 grey-313">
                {isIcon ? <Image src={coinImage} /> : null}
                {coinText}</Badge>
        </div>
    );
}

export default CustomChip;