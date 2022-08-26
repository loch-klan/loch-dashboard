import React from 'react'
import { Image, Container, NavLink, Button } from 'react-bootstrap'

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
function Sidebar() {
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
                                    <Image src={HomeIcon} />
                                    <NavLink to="/"  >Home</NavLink>
                                </li>
                                <li>
                                    <Image src={IntelligenceIcon} />
                                    <NavLink to="/Intelligence">Intelligence</NavLink>
                                </li>
                                <li>
                                    <Image src={NavWalletIcon} />
                                    <NavLink to="/Wallets">Wallets</NavLink>
                                </li>
                                <li>
                                    <Image src={DollarIcon} />
                                    <NavLink to="/Costs">Costs</NavLink>
                                </li>
                                <li>
                                    <Image src={ProfileIcon} />
                                    <NavLink to="/profile">Profile</NavLink>
                                </li>
                            </ul>
                        </nav>

                        <div className="nav-addwallet">
                            <Image fluid src={bgImg} />
                            <div className='wallet-info-para'>
                                <p>Viewing in Demo Mode</p>
                                <p>Showing sample data based
                                    on <span>Vitalik Buterin’s </span> wallet</p>
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
