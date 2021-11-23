import React from "react";
import {
  Nav,
  NavLogo,
  NavbarContainer,
  NavIcon,
  NavMenu,
  NavMenuItem,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./NavbarStyled";
import { MenuOutline } from "@styled-icons/evaicons-outline";
import "../../../App.css"
import { Link } from "react-router-dom";

const NavBar = ({ toggle }) => {
  return (
    <Nav>
      <NavLogo to="/">DBMSAdmin</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
        <NavMenu>
          {/* <NavMenuItem>
            <NavLinks to="/adminprofile/guesthouseadmin">Guesthouse</NavLinks>
          </NavMenuItem> */}
          <NavMenuItem>
            <div className="dropdown">
              <p>Guesthouse</p>
              <div className="dropdown-content">
                <Link to="/adminprofile/roomadmin">Room bookings</Link>
                <Link to="/adminprofile/staffadmin">Staff</Link>
              </div>
            </div>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/marketadmin">Market</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/gardenadmin">Landscaping</NavLinks>
          </NavMenuItem>
        </NavMenu>
      </NavbarContainer>
      <NavBtn>
        <NavBtnLink to="/Login">Profile</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default NavBar;
