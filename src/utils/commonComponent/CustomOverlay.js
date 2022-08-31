import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Image, Tooltip } from "react-bootstrap";
import infoicon from "../../assets/images/icons/lock-icon.svg";

function CustomOverlay({ text, position, isIcon, children }) {
    const renderTooltip = (props) => (
        <Tooltip className="tool-tip-container" id="button-tooltip" {...props}>
            <div className='button-tooltip'>
                {isIcon ? <Image src={infoicon} /> : null}
                <span className="inter-display-medium f-s-13 lh-16">{text}</span>
            </div>
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement={position}
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}>
            {children}
        </OverlayTrigger>
    );
}

export default CustomOverlay;