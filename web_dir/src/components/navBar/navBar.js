import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './navBarElements';
import './navBar.css'
  
const Navbar = () => {
  return (
    <>
      <Nav className="nav_bar">
        <Bars />

        <NavMenu>
          <NavLink to='/' activeStyle>
            HOME
          </NavLink>
          {/* Second Nav */}
          {/* <NavBtnLink to='/sign-in'>Sign In</NavBtnLink> */}
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/begin'>begin call</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;