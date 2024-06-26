import React from "react";

import NavigationSidebar from "@/components/navigations/navigation-sidebar";
import { useModalStore } from "@/hooks/use-modal-store";

type Props = {
  children: React.ReactNode;
};

const MainLayout = async ({ children }: Props) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
