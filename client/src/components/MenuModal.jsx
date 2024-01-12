import React, {useState, useEffect, useRef} from 'react';
import Auth from '../utils/auth';
import {Modal} from 'react-bootstrap';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import VerifyEmailModal from './VerifyEmailModal';

const MenuModal = ({
    show, 
    handleClose,
    handlePageChange,
    currentPage,
    isAboutOpen,
    isLoginOpen,
    showLoginModal,
    showSignupModal,
    showVerifyModal,
    accOpen,
    toggleLoginModal,
    toggleSignupModal,
    toggleShowVerifyModal,
    closeVerifyModal,
    closeSignupModal,
    closeLoginModal,
    toggleLogin,
    toggleAcc,
    toggleAbout, 
    closeAbout,
    isMenuOpen,
    userEmail,
    setAccOpen,
    setIsAboutOpen,
    setLoginOpen,
    setShowLoginModal,
    setShowSignupModal,
    setShowVerifyModal
}) => {

    setAccOpen(false);
    setIsAboutOpen(false);
    setLoginOpen(false);
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowVerifyModal(false);
    
    const aboutRef = useRef(null);
    const loginRef = useRef(null);
    const menuRef = useRef(null);
    const accRef = useRef(null);

    useEffect(()=>{
        const handleOutsideClick = (event) => {
            if(aboutRef.current && !aboutRef.current.contains(event.target)){
                closeAbout();
            }
            if(loginRef.current && !loginRef.current.contains(event.target)){
                closeLogin();
            }
            if (
                (menuRef.current && !menuRef.current.contains(event.target)) &&
                !(event.target.tagName === 'A' && event.target.closest('#menu'))
            ) {
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
    }, [isMenuOpen])   

    const user = Auth.getProfile();
    
    const isOwner = Auth.hasAccess(userEmail);

    const logout = (event) => {
    event.preventDefault();
    Auth.logout();
    };
    

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Menu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul id='menu' className='nav nav-tabs col-lg-8 col-10 justify-content-end'>
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
            </Modal.Body>
        </Modal>
    )
};

export default MenuModal;