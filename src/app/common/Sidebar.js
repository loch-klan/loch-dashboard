import React from 'react'
import { Image, Container, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import logo from '../../image/logo.png'

import ActiveHomeIcon from '../../image/HomeIcon.svg'
import InActiveHomeIcon from '../../image/InactiveHomeIcon.png'

import IntelligenceIcon from '../../image/IntelligenceIcon.png'
import ActiveIntelligenceIcon from '../../image/ActiveIntelligenceIcon.png'
import NavWalletIcon from '../../image/NavWalletIcon.png'
import ActiveWalletIcon from '../../image/ActiveWalletIcon.png'
import ProfileIcon from '../../image/ProfileIcon.png'
import ActiveProfileIcon from '../../image/ActiveProfileIcon.png'
import DollarIcon from '../../image/DollarIcon.png'
import ActiveDollarIcon from '../../image/ActiveDollarIcon.png'

import ExportIcon from '../../image/ExportIcon.png'
import ApiIcon from '../../image/ApiIcon.png'
import LeaveIcon from '../../image/LeaveIcon.png'
import DarkmodeIcon from '../../image/DarkmodeIcon.png'
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
                                    className="nav-link"    to="/"
                                       activeclassname="active">
                                         <Image src={activeTab === '/' ? ActiveHomeIcon : InActiveHomeIcon} />Home</NavLink>
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
