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
      <NavLogo to="/">Shopkeeper</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline />
        </NavIcon>
        <NavMenu>
          <NavMenuItem>
            <NavLinks to="/shopkeeperprofile/reminders">Reminders</NavLinks>
          </NavMenuItem>
          <NavMenuItem>
            <NavLinks to="/shopkeeperprofile/addshopreceipt">Add receipt</NavLinks>
          </NavMenuItem>
        </NavMenu>
      </NavbarContainer>
    </Nav>
  );
};

export default NavBar;
