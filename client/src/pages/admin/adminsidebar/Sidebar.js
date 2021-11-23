import React from "react";

import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SidebarLink,
  SidebarWrapper,
  SidebarMenu,
  SidebarBtnWrap,
  SidebarButton,
} from "./SidebarStyled";
const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarLink to="/guesthouseadmin">Guesthouse</SidebarLink>
          <SidebarLink to="/marketadmin">Market</SidebarLink>
          <SidebarLink to="/landscapingadmin">Landscaping</SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
      <SidebarBtnWrap>
        <SidebarButton to="/Login">Log out</SidebarButton>
      </SidebarBtnWrap>
    </SidebarContainer>
  );
};

export default Sidebar;
