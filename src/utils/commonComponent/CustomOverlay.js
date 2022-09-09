import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Image, Tooltip } from "react-bootstrap";




function CustomOverlay({ text, position, isIcon, children, IconImage, isInfo, isText }) {


    const renderTooltip = (props) => (
        <Tooltip className={isText ? "text-tooltip-container" :"tool-tip-container"} id="button-tooltip" {...props}>
            {isInfo ?
                <div className={isText ? "text-tooltip" : "button-tooltip"}>
                    {isIcon ? <Image src={IconImage} />  :  null}
                    <span className="inter-display-medium f-s-13 lh-16">{text}</span>
                </div> :
                    <ul>
                        {text.map((e, i) =>
                            i != 0 ?
                                <li key={i}>
                                    <Image src={e.coinSymbol} /><span>{e.coinName}</span>
                                </li>
                                : null
                        )}
                    </ul>

            }
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