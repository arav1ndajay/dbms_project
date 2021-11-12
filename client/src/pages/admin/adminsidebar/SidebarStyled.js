import { styled } from "@stitches/react";
import { Link as LinkR } from "react-router-dom";
import { CloseOutline } from "@styled-icons/evaicons-outline";

export const SidebarContainer = styled("div", {
  position: "fixed",
  zIndex: "100",
  width: "100vw",
  height: "100vh",
  background: "black",
  display: "grid",
  alignItems: "center",
  left: 0,
  transition: "0.1s ease-in-out",

  opacity: "100%",
  top: "-100%",

  variants: {
    isOpen: {
      true: {
        opacity: "100%",
        top: "0",
      },
    },
  },
});

export const CloseIcon = styled(CloseOutline, {
  color: "#fff",
});

export const Icon = styled("div", {
  position: "absolute",
  top: "1rem",
  right: "1.5rem",
  height: "2.5rem",
  width: "2.5rem",
  background: "transparent",
  fontSize: "2rem",
  cursor: "pointer",
  outline: "none",
});

export const SidebarWrapper = styled("div", {
  color: "#fff",
});

export const SidebarMenu = styled("ul", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "repeat(4, 100px)",
  textAlign: "center",
  margin: 0,
  padding: 0,
});

export const SidebarLink = styled(LinkR, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  fontSize: "2rem",
  listStyle: "none",
  transition: "0.1s ease-in-out",
  color: "#fff",

  "&:hover": {
    color: "$success",
    transition: "0.1s ease-in-out",
    textDecoration: "none",
  },
});

export const SidebarBtnWrap = styled("div", {
  display: "flex",
  justifyContent: "center",
});

export const SidebarButton = styled(LinkR, {
  borderRadius: "20px",
  background: "#504d54",
  whiteSpace: "nowrap",
  padding: "16px 64px",
  color: "white",
  fontSize: "16px",
  outline: "none",
  border: "none",
  cursor: "pointer",
  transition: "all 0.1s ease-in-out",
  textDecoration: "none",

  "&:hover": {
    transform: "scale(1.1)",
    transition: "all 0.1s ease-in-out",
    textDecoration: "none",
    background: "rgb(164, 121, 182)",
    color: "$darkGrey",
  },
});
