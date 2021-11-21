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

const NavBar = ({ toggle }) => {
  return (
    <Nav>
      <NavLogo to="/">Guest</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
        <NavMenu>
          <NavMenuItem>
            <NavLinks to="/guesthouseadmin">Order food</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/marketadmin">Book room</NavLinks>
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
