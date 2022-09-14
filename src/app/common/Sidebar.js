import React from 'react'
import { Image, Container, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import logo from '../../image/logo.png'

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
import ApiIcon from '../../assets/images/icons/ApiIcon.svg'
import LeaveIcon from '../../assets/images/icons/LeaveIcon.svg'
import DarkmodeIcon from '../../assets/images/icons/DarkmodeIcon.svg'
import bgImg from '../../image/Notice.png'
function Sidebar(props) {


    const activeTab = window.location.pathname
    return (
        <div className='sidebar-section'>
            <Container>
                <div className="sidebar">
                    <div className='logo'>
                        <Image src={logo} />
                    </div>
                    <div className={ props.ownerName ? 'sidebar-body':'sidebar-body nowallet'}>
                        <nav>
                            <ul>
                                <li>
                                    <NavLink
                                    exact={true}
                                    className="nav-link"    to="/portfolio"
                                       activeclassname="active">
                                         <Image src={activeTab === '/portfolio' ? ActiveHomeIcon : InActiveHomeIcon} />Home</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    exact={true}
                                        className="nav-link" to="/intelligence"
                                        activeclassname="active"
                                        ><Image src={activeTab === "/intelligence" ? ActiveIntelligenceIcon :IntelligenceIcon } />Intelligence</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    exact={true}
                                        className="nav-link" to="/wallets"
                                      activeclassname="active"
                                      ><Image src={activeTab === "/wallets" ?ActiveWalletIcon:NavWalletIcon} />Wallets</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="nav-link"
                                        to="/costs"
                                        activeclassname="active"
                                    >
                                        <Image src={activeTab === "/costs" ? ActiveDollarIcon:DollarIcon} />Costs</NavLink>
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

                    <div className='sidebar-footer'>
                        <ul>
                            <li>
                                <Image src={ExportIcon} />
                                <Button className="navbar-button">Export</Button>
                            </li>
                            <li>
                                <Image src={ApiIcon} />
                                <Button className="navbar-button">Api</Button>
                            </li>
                            <li>
                                <Image src={DarkmodeIcon} />
                                <Button className="navbar-button">Dark Mode</Button>
                            </li>
                            <li>
                                <Image src={LeaveIcon} />
                                <Button className="navbar-button">Leave</Button>
                            </li>
                        </ul>

                        <p >
                            Sic Parvis Magna |
                            Thus, great things from small things come.
                        </p>
                        <p >Sir Francis Drake</p>


                    </div>
                </div>
            </Container>

        </div>
    )
}

export default Sidebar
