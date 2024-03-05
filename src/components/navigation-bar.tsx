"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";

const PAGE_ROUTES = {
  user: [{ label: "My Courses", url: "/courses/" }],
  admin: [{ label: "User Management", url: "/user-management" }],
};

export default function NavigationBar({
  type,
  user,
}: {
  type: "user" | "admin";
  user: User;
}) {
  return (
    <NavigationMenu>
      <span className="font-bold text-lg">ITS Management System</span>
      <NavigationMenuList>
        {PAGE_ROUTES[type].map((page, index) => (
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href={page.url}
            key={index}
          >
            {page.label}
          </NavigationMenuLink>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>PIC</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p>My Account {type === "admin" && "[Admin]"}</p>
              <p className="font-light">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/">Change Password</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/api/auth/signout">Sign Out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
