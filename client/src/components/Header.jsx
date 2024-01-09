// TODO : create header component. That should have the logo and a navbar

// navbar should have these links: About Me, Portfolio, Contact, Resume
// The title corresponding to the current section is highlighted

// when the portfolio is loaded for the first time, then the about me title and section are selected by default

import React, { useState, useEffect, useRef } from 'react';
import Auth from '../utils/auth';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import VerifyEmailModal from './VerifyEmailModal';
import '../styles/Header.css'



function Header({currentPage, handlePageChange, username, userEmail}) {

    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [accOpen, setAccOpen] = useState(false);

    const aboutRef = useRef(null);
    const loginRef = useRef(null);
    const menuRef = useRef(null);
    const accRef = useRef(null);

    
    const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
    const toggleSignupModal = () => setShowSignupModal(!showSignupModal);
    const toggleShowVerifyModal = () => setShowVerifyModal(!showVerifyModal);
    const closeVerifyModal = () => setShowVerifyModal(false);    
    const closeSignupModal = () => setShowSignupModal(false);
    const closeLoginModal = () => setShowLoginModal(false);
    const toggleLogin = () => setLoginOpen(!isLoginOpen);
    const closeLogin = () => setLoginOpen(false);
    const toggleAcc = () => setAccOpen(!accOpen);
    const closeAcc = () => setAccOpen(false);
    const toggleMenu = () => setMenuOpen(!isMenuOpen);
    const closeMenu = () => setMenuOpen(false);
    const toggleAbout = () => setIsAboutOpen(!isAboutOpen);
    const closeAbout = () => setIsAboutOpen(false); 

    useEffect(()=>{
        const handleOutsideClick = (event) => {
            if(aboutRef.current && !aboutRef.current.contains(event.target)){
                closeAbout();
            }
            if(loginRef.current && !loginRef.current.contains(event.target)){
                closeLogin();
            }
            if(menuRef.current && !menuRef.current.contains(event.target)){
                closeMenu();
            }
            if(accRef.current && !accRef.current.contains(event.target)){
                closeAcc();
            }
        }

        document.body.addEventListener('click', handleOutsideClick);

        return ()=> {
            document.body.removeEventListener('click', handleOutsideClick);
        }
    })   

    const user = Auth.getProfile();
    
    const isOwner = Auth.hasAccess(userEmail);

    const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    };


    return (
        <div className='fluid pt-4 pe-4 ps-4  mb-3 border-bottom border-secondary'>
            <div className="row mb-3">
                <div className='col-8 col-md-4 col-xl-2' >                                     
                        <img id='logo' className='img-fluid rounded' src="images/pseudocoderLogoCut.png" alt="Pseudocoder Logo" />
                </div>
                                
                <ul id='menu' ref={menuRef} className= {window.innerWidth > 992 ? 'nav nav-tabs col-lg-8 col-10 justify-content-end' :'nav bg-secondary text-decoration-none text-white flex-column float-right justify-content-end collapse'}>
                    <li className="nav-item">
                        <a href="#home" 
                        onClick={() => handlePageChange("Home")}
                        className={currentPage === "Home" ? "active nav-link" : "nav-link"}
                        >Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="#pseudocodes" 
                        onClick={() => handlePageChange("Pseudocodes")}
                        className={currentPage === "Pseudocodes" || currentPage === "Pseudocode" ? "active nav-link" : "nav-link"}
                        >Pseudocodes</a>
                    </li>
                    <li className="nav-item dropdown" ref={aboutRef}>
                        <a
                        href="#about"
                        onClick={() => {
                            toggleAbout();
                            handlePageChange("About");
                        }}
                        className={`nav-link dropdown-toggle ${currentPage === "About" || currentPage === "Portfolio" ? "active" : ""}`}
                        >
                        About Me
                        </a>
                        <div className={`dropdown-menu ${isAboutOpen ? 'show text-bg-light border-4' : ''}`} aria-labelledby="aboutDropdown">
                        <a
                            href="#about"
                            onClick={() => {
                            handlePageChange("About");
                            closeAbout();
                            }}
                            className={`dropdown-item ${currentPage === "About" ? "active" : ""}`}
                        >
                            Who Am I
                        </a>
                        <a
                            href="#portfolio"
                            onClick={() => {
                            handlePageChange("Portfolio");
                            closeAbout();
                            }}
                            className={`dropdown-item ${currentPage === "Portfolio" ? "active" : ""}`}
                        >
                            Portfolio
                        </a>
                        <a href="#contact" 
                        onClick={() => handlePageChange("Contact")}
                        className={`dropdown-item ${currentPage === "Contact" ? "active" : ""}`}
                        >Contact</a>
                        <a href="#resume" 
                        onClick={() => handlePageChange("Resume")}
                        className={`dropdown-item ${currentPage === "Resume" ? "active" : ""}`}
                        >Resume</a>
                        </div>
                    </li>
                    
                    {isOwner && (
                        <li className='nav-item'>
                            <a
                            href="#dashboard"
                            onClick={() => handlePageChange("Dashboard")}
                            className={currentPage === "Dashboard" ? "active nav-link" : "nav-link"}
                            >Dashboard
                            </a>
                        </li>
                    )}
                
                {Auth.loggedIn() ? (
                        <li className='nav-item' ref={accRef}>
                        <a onClick={()=>toggleAcc()}
                          className='nav-link dropdown-toggle'>
                              Your Account
                        </a>
                      
                        <div className={`dropdown-menu ${accOpen ? 'show text-bg-light border-4' : ''}`} aria-labelledby="aboutDropdown">
                        {!user.data.verified && <a 
                          className='dropdown-item'
                          onClick={()=>{
                              toggleShowVerifyModal();
                          }}
                          >
                              <b>Verify Your Account</b>
                          </a>}
                          <VerifyEmailModal show={showVerifyModal} handleClose={closeVerifyModal} />
                          <a onClick={logout}
                            className='dropdown-item text-danger'>
                                Logout
                            </a>
                        </div>
                      </li>
                    ) : (
                        
                        <li className="nav-item" ref={loginRef}>
                            <a onClick={() => {
                                toggleLogin();
                            }}
                            className={`nav-link dropdown-toggle`} >
                            Login/Signup
                            </a>

                            <div className={`dropdown-menu ${isLoginOpen ? 'show text-bg-light border-4' : ''}`} aria-labelledby="aboutDropdown">
                                <a 
                                className='dropdown-item'
                                onClick={()=>{
                                    toggleLoginModal();
                                }}
                                >
                                    <b>Login</b>
                                </a>
                                <LoginModal show={showLoginModal} handleClose={closeLoginModal} />
                                <a
                                className='dropdown-item'
                                onClick={()=>{
                                    toggleSignupModal();
                                }}    
                                >
                                    <b>Create Account</b>
                                </a>
                                <SignupModal show={showSignupModal} handleClose={closeSignupModal} />
                            </div>
                        </li>
                        
                    )}
                </ul>

                        
                {window.innerWidth <= 992 && <button className="btn btn-dark col" 
                type="button"
                id='menuTogglerBtn'
                onClick={()=>{toggleMenu()}} 
                data-bs-toggle="collapse" 
                data-bs-target="#menu" 
                aria-controls="menu" 
                aria-expanded="false" 
                aria-label="Toggle navigation">
                {isMenuOpen ? 'Close Menu' : 'Menu'}
                </button>}                

            {/* row */}
            </div > 
            
            {Auth.loggedIn() && <div>
                {!user?.data.verified && <div className='alert alert-danger'>
                    <p>You cannot leave comments because your email has not been verified.</p>
                    <p>To verify your account click <a className='text-primary' onClick={() => toggleShowVerifyModal()}>here</a></p>
                    <VerifyEmailModal show={showVerifyModal} handleClose={closeVerifyModal} />
                </div>}
            </div>}
            
            
        {/* container */}
        </div>
    )

    
};

export default Header;