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
      <NavLogo to="/guestprofile">Guest</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
        <NavMenu>
          <NavMenuItem>
            <NavLinks to="/guestprofile/orderfood">Order food</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/guestprofile/bookroom">Book room</NavLinks>
          </NavMenuItem>
        </NavMenu>
      </NavbarContainer>
    </Nav>
  );
};

export default NavBar;
