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
              <p style={{ margin: "10px" }}>Guesthouse</p>
              <div className="dropdown-content">
                <Link to="/adminprofile/roomadmin">Room bookings</Link>
                <Link to="/adminprofile/staffadmin">Staff</Link>
                <Link to="/adminprofile/foodadmin">Food related</Link>
              </div>
            </div>
          </NavMenuItem>
          <NavMenuItem>
            <div className="dropdown">
              <p style={{ margin: "10px" }}>Market shops</p>
              <div className="dropdown-content">
                <Link to="/adminprofile/shopserviceadmin">Shop Services</Link>
                <Link to="/adminprofile/feedbacksadmin">Feedbacks</Link>
                <Link to="/adminprofile/paymentsadmin">Payments</Link>
              </div>
            </div>
          </NavMenuItem>
          <NavMenuItem>
            <div className="dropdown">
              <p>Gardening</p>
              <div className="dropdown-content">
                <Link to="/adminprofile/gardenadmin">Gardener</Link>
                <Link to="/adminprofile/mechanicadmin">Tools / Mechanic</Link>
                <Link to="/adminprofile/arearequestadmin">
                  Area and Request
                </Link>
              </div>
            </div>
          </NavMenuItem>
        </NavMenu>
      </NavbarContainer>
    </Nav>
  );
};

export default NavBar;
