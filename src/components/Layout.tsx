import { SidebarLayout } from "./catalyst/sidebar-layout.tsx";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "./catalyst/navbar.tsx";
import { Avatar } from "./catalyst/avatar.tsx";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./catalyst/dropdown.tsx";
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "./catalyst/sidebar.tsx";
import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/my-profile">
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar src="/tailwind-logo.svg" />
                <SidebarLabel>ClassM8</SidebarLabel>
              </DropdownButton>
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/">
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/events">
                <SidebarLabel>Classes</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/orders">
                <SidebarLabel>Scenes</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/settings">
                <SidebarLabel>Roster</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="/support">
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog">
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
};
