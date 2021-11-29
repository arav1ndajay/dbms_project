import React from "react";
import {
  Nav,
  NavLogo,
  NavbarContainer,
  NavIcon,
} from "./NavbarStyled";
import { MenuOutline } from "@styled-icons/evaicons-outline";

const NavBar = ({ toggle }) => {
  return (
    <Nav>
      <NavLogo to="/">Mechanic</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
      </NavbarContainer>
    </Nav>
  );
};

export default NavBar;
