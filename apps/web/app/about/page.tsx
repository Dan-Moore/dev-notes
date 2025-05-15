import { DefaultHeader } from "@/components/headers";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function Page() {

  return (
    
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <DefaultHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <span>todo - page stats</span>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
