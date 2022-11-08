import React from 'react'
import { Image, Container, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
// import logo from '../../image/logo.png'
import logo from '../../image/Loch.svg'

import ActiveHomeIcon from '../../image/HomeIcon.svg'
import InActiveHomeIcon from '../../assets/images/icons/InactiveHomeIcon.svg'
import ActiveIntelligenceIcon from '../../assets/images/icons/ActiveIntelligenceIcon.svg';
import IntelligenceIcon from '../../assets/images/icons/InactiveIntelligenceIcon.svg';
import NavWalletIcon from '../../assets/images/icons/InactiveWalletIcon.svg'
import ActiveWalletIcon from '../../assets/images/icons/ActiveWalletIcon.svg'
import ProfileIcon from '../../assets/images/icons/InactiveProfileIcon.svg'
import ActiveProfileIcon from '../../assets/images/icons/ActiveProfileIcon.svg'
import DollarIcon from '../../assets/images/icons/InactiveCostIcon.svg'
import ActiveDollarIcon from '../../assets/images/icons/ActiveCostIcon.svg'

import ExportIcon from '../../assets/images/icons/ExportIcon.svg'
import ExportIconWhite from '../../assets/images/icons/ExportBlackIcon.svg'
import ApiIcon from '../../assets/images/icons/ApiIcon.svg'
import ApiBlackIcon from '../../assets/images/icons/ApiBlackIcon.svg'
import LeaveIcon from '../../assets/images/icons/LeaveIcon.svg'
import LeaveBlackIcon from '../../assets/images/icons/LeaveBlackIcon.svg'
import DarkmodeIcon from '../../assets/images/icons/DarkmodeIcon.svg'
import bgImg from '../../image/Notice.png'
import {useHistory} from 'react-router-dom'
import ExitOverlay from './ExitOverlay'
import { BASE_URL_S3 } from '../../utils/Constant'
import { toast } from 'react-toastify'
import ApiModalIcon from '../../assets/images/icons/ApiModalIcon.svg';
function Sidebar(props) {
// console.log('props',props);

    const activeTab = window.location.pathname
    const history = useHistory();
    const [leave, setLeave] = React.useState(false);
    const [apiModal,setApiModal]  =React.useState(false);
    const [exportModal,setExportModal] = React.useState(false)

    const handleLeave = () => {
      const isDummy = localStorage.getItem("lochDummyUser");
      if(isDummy){
        setLeave(!leave)
      } else{
        props.history.push('/home');
      }
    }

    const handleApiModal = ()=>{
        setApiModal(!apiModal)
    }
    const handleExportModal = ()=>{
        setExportModal(!exportModal)
    }
    const handleShare=()=>{
      const link= `${BASE_URL_S3}portfolio/${localStorage.getItem("lochDummyUser")}`
      navigator.clipboard.writeText(link);
      toast.success("Share link has been copied");
    }

    return (
        <div className='sidebar-section'>
            <Container>
                <div className="sidebar">
                  <div style={{width: "100%"}}>
                    <div className='logo'>
                        <Image src={logo} />
                        <span className='loch-text'>Loch</span>
                    </div>
                    <div className={props.ownerName ? 'sidebar-body' : 'sidebar-body nowallet'}>
                        <nav>
                            <ul>
                                <li>
                                    <NavLink
                                        exact={true}
                                        className="nav-link" to="/portfolio"
                                        activeclassname="active">
                                        <Image src={activeTab === '/portfolio' ? ActiveHomeIcon : InActiveHomeIcon} />Home</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        exact={true}
                                        className="nav-link" to="/intelligence"
                                        activeclassname="active"
                                    ><Image src={activeTab === "/intelligence" ? ActiveIntelligenceIcon : IntelligenceIcon} />Intelligence</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        exact={true}
                                        className="nav-link" to="/wallets"
                                        activeclassname="active"
                                    ><Image src={activeTab === "/wallets" ? ActiveWalletIcon : NavWalletIcon} />Wallets</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="nav-link"
                                        to="/costs"
                                        activeclassname="active"
                                    >
                                        <Image src={activeTab === "/costs" ? ActiveDollarIcon : DollarIcon} />Costs</NavLink>
                                </li>

                                  <li>
                                    <NavLink
                                        exact={true}
                                        className="nav-link"
                                        to="/profile"
                                        activeclassname="active"
                                    >
                                        <Image src={
                                            activeTab === '/profile' ? ActiveProfileIcon : ProfileIcon
                                        } />Profile</NavLink>
                                </li>
                            </ul>
                        </nav>

                        {/* {props.ownerName &&
                        <div className="nav-addwallet">
                            <Image fluid src={bgImg} />
                            <div className='wallet-info-para'>
                                <p>Viewing in Demo Mode</p>
                                <p>Showing sample data based
                                    on <span>{props.ownerName}</span> wallet</p>
                                <Button className='addwallet-btn'>Add wallet</Button>
                            </div>
                        </div> } */}
                    </div>
                    </div>
                    <div className='sidebar-footer'>
                        <ul>
                            <li
                                onMouseOver={e => (e.currentTarget.children[0].src=ExportIconWhite)}
                                onMouseLeave={e => (e.currentTarget.children[0].src=ExportIcon)}
                                onClick={handleExportModal}
                            >
                                <Image src={ExportIcon}/>
                                <Button className="inter-display-medium f-s-15 lh-19 navbar-button">Export</Button>
                            </li>
                            <li
                                onMouseOver={e => (e.currentTarget.children[0].src=ApiBlackIcon)}
                                onMouseLeave={e => (e.currentTarget.children[0].src=ApiIcon)}
                                onClick={handleApiModal}
                            >
                                <Image src={ApiIcon}/>
                                <Button className="inter-display-medium f-s-15 lh-19 navbar-button">API</Button>
                            </li>
                            {
                              JSON.parse(localStorage.getItem('lochUser')) &&
                              <li>
                                <Image src={DarkmodeIcon} />
                                <Button
                                  className="inter-display-medium f-s-15 lh-19 navbar-button"
                                  onClick={handleShare}
                                >
                                  Share Profile
                                </Button>
                              </li>
                            }

                            <li onClick={handleLeave}
                                onMouseOver={e => (e.currentTarget.children[0].src=LeaveBlackIcon)}
                                onMouseLeave={e => (e.currentTarget.children[0].src=LeaveIcon)}
                            >
                                <Image src={LeaveIcon} />
                                <Button className="inter-display-medium f-s-15 lh-19 navbar-button">Leave</Button>
                            </li>
                        </ul>

                        <div className='m-b-12 footer-divOne'>
                            <p className='inter-display-medium f-s-15 grey-CAC lh-19' style={{ fontStyle: "italic" }}>"Sic Parvis Magna</p>
                            <p className='inter-display-medium f-s-15 grey-CAC lh-19'>Thus, great things from </p>
                            <p className='inter-display-medium f-s-15 grey-CAC lh-19'>small things come."</p>
                        </div>
                        <div className="inter-display-semi-bold f-s-15 grey-B0B lh-19 footer-divTwo m-b-40">Sir Francis Drake</div>

                        {/* <p className='inter-display-medium f-s-15 grey-CAC lh-19' style={{fontStyle: "italic"}}>Sic Parvis Magna <span style={{fontStyle: "normal"}}>|</span>  </p>
                        <p className='inter-display-medium f-s-15 grey-CAC lh-19'>Thus, great things from small things come.</p>
                        <p className='inter-display-semi-bold f-s-15 grey-B0B lh-19'>Sir Francis Drake</p> */}
                    </div>
                </div>
            </Container>

            {
                leave ?
                    <ExitOverlay
                        show={leave}
                        // link="http://loch.one/a2y1jh2jsja"
                        onHide={handleLeave}
                        history={history}
                        modalType={"exitOverlay"}
                        handleRedirection={()=>{setTimeout(function(){
                          props.history.push('/home');
                       }, 3000)}}
                    /> : ""
            }
            {
                apiModal ?
                <ExitOverlay
                    show = {apiModal}
                    onHide = {handleApiModal}
                    history={history}
                    headerTitle={"Api"}
                    modalType={'apiModal'}
                    iconImage={ApiModalIcon}
                />
                :""
            }
            {
                exportModal ?
                <ExitOverlay
                    show = {exportModal}
                    onHide = {handleExportModal}
                    history={history}
                    headerTitle={"Export"}
                    modalType={'apiModal'}
                    iconImage={ExportIconWhite}
                />
                :""
            }
        </div>
    )
}

export default Sidebar
