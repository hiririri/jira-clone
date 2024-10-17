"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet modal={false}>
      <SheetTrigger asChild>
        <Button variant={"secondary"} className={"lg:hidden"}>
          <MenuIcon className={"size-4 text-neutral-500"} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className={"p-0"}>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
