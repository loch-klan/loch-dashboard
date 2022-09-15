import React from 'react'
import { Image, Container, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import logo from '../../image/logo.png'
import HomeIcon from '../../image/HomeIcon.png'
import IntelligenceIcon from '../../image/IntelligenceIcon.png'
import NavWalletIcon from '../../image/NavWalletIcon.png'
import ProfileIcon from '../../image/ProfileIcon.png'
import DollarIcon from '../../image/DollarIcon.png'
import ExportIcon from '../../image/ExportIcon.png'
import ApiIcon from '../../image/ApiIcon.png'
import LeaveIcon from '../../image/LeaveIcon.png'
import DarkmodeIcon from '../../image/DarkmodeIcon.png'
import bgImg from '../../image/Notice.png'
function Sidebar(props) {
    return (
        <div className='sidebar-section'>
            <Container>
                <div className="sidebar">
                    <div className='logo'>
                        <Image src={logo} />
                    </div>
                    <div className='sidebar-body'>
                        <nav>
                            <ul>
                                <li>
                                    <NavLink
                                    exact={true}
                                    className="nav-link" to="/portfolio"
                                       activeclassname="active"> <Image src={HomeIcon} />Home</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    exact={true}
                                        className="nav-link" to="/intelligence"
                                        activeclassname="active"
                                        ><Image src={IntelligenceIcon} />Intelligence</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    exact={true}
                                        className="nav-link" to="/wallets"
                                      activeclassname="active"
                                      ><Image src={NavWalletIcon} />Wallets</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className="nav-link"
                                        to="/costs"
                                        activeclassname="active"
                                    >
                                        <Image src={DollarIcon} />Costs</NavLink>
                                </li>
                                <li>
                                    <NavLink
                                    exact={true}
                                        className="nav-link"
                                        to="/profile"
                                        activeclassname="active"
                                    > <Image src={ProfileIcon} />Profile</NavLink>
                                </li>
                            </ul>
                        </nav>

                        <div className="nav-addwallet">
                            <Image fluid src={bgImg} />
                            <div className='wallet-info-para'>
                                <p>Viewing in Demo Mode</p>
                                <p>Showing sample data based
                                    on <span>{props.ownerName}</span> wallet</p>
                                <Button className='addwallet-btn'>Add wallet</Button>
                            </div>
                        </div>
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

                        <p className='inter-display-medium f-s-16 grey-CAC lh-19' style={{fontStyle: "italic"}}>Sic Parvis Magna <span style={{fontStyle: "normal"}}>|</span>  </p>
                        <p className='inter-display-medium f-s-16 grey-CAC lh-19'>Thus, great things from small things come.</p>
                        <p className='inter-display-semi-bold f-s-16 grey-B0B lh-19'>Sir Francis Drake</p>
                    </div>
                </div>
            </Container>

        </div>
    )
}

export default Sidebar
