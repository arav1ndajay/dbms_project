import React from "react";
import {
  Nav,
  NavLogo,
  NavbarContainer,
  NavIcon,
  NavBtn,
  NavBtnLink,
} from "./NavbarStyled";
import { MenuOutline } from "@styled-icons/evaicons-outline";

const NavBar = ({ toggle }) => {
  return (
    <Nav>
      <NavLogo to="/staffprofile">Staff</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
      </NavbarContainer>
      <NavBtn>
        <NavBtnLink to="/Login">Profile</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default NavBar;
