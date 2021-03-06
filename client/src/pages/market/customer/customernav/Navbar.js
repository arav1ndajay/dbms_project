import React from "react";
import {
  Nav,
  NavLogo,
  NavbarContainer,
  NavIcon,
  NavMenu,
  NavMenuItem,
  NavLinks,

} from "./NavbarStyled";
import { MenuOutline } from "@styled-icons/evaicons-outline";

const NavBar = ({ toggle }) => {
  return (
    <Nav>
      <NavLogo to="/">Customer</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
        <NavMenu>
          <NavMenuItem>
            <NavLinks to="/customerprofile/customerfeedback">Give feedback</NavLinks>
          </NavMenuItem>
        </NavMenu>
      </NavbarContainer>
    </Nav>
  );
};

export default NavBar;
