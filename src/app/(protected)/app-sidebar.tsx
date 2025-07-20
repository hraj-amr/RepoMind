'use client';

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Bot, LayoutDashboard, Presentation, CreditCard, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import useProject from '@/hooks/use-project' // Assuming this path is correct

// Define the navigation items for the sidebar
const items = [
    {
        title: "Dashboard",
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: "Q&A",
        url: '/qa',
        icon: Bot,
    },
    {
        title: "Meetings",
        url: '/meetings',
        icon: Presentation,
    },
    {
        title: "Billing",
        url: "/billing",
        icon: CreditCard,
    }
];

// AppSidebar functional component
export function AppSidebar() {
    const pathname = usePathname(); // Get current pathname for active link highlighting
    const { open } = useSidebar(); // Hook to get sidebar open state (assuming from @/components/ui/sidebar)
    const { projects, projectId, setProjectId } = useProject(); // Custom hook to manage projects

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    {/* Application Logo */}
                    <Image src='/repomind_logo_square.png' alt='RepoMind Logo' width={40} height={40} />
                </div>
            </SidebarHeader>

            <SidebarContent>
                {/* Application Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Map through the defined navigation items */}
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        {/* Link to navigate to the item's URL */}
                                        <Link href={item.url} className={cn({
                                            // Apply active styling if the current pathname matches the item's URL
                                            'bg-primary !text-white': pathname === item.url
                                        }, 'list-none')}>
                                            {/* Render the icon component */}
                                            <item.icon />
                                            {/* Display the item title */}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Your Projects Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Map through the user's projects */}
                            {projects?.map(project => (
                                <SidebarMenuItem key={project.id}> {/* Using project.id for unique key */}
                                    <SidebarMenuButton asChild>
                                        {/* Clickable div to set the active project ID */}
                                        <div
                                            onClick={() => setProjectId(project.id)} // Corrected to onClick
                                            className="flex items-center gap-2 cursor-pointer w-full" // Added cursor-pointer for better UX
                                        >
                                            {/* Project initial display */}
                                            <div className={cn(
                                                'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                                                {
                                                    // Apply active styling if this project is currently selected
                                                    'bg-primary text-white': project.id === projectId
                                                }
                                            )}>
                                                {project.name[0]} {/* Display first letter of project name */}
                                            </div>
                                            {/* Project name */}
                                            <span>{project.name}</span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <div className="h-2"></div> {/* Spacer */}
                            {/* "Create Project" button, visible only when sidebar is open */}
                            {open && (
                                <SidebarMenuItem>
                                    <Link href='/create'>
                                        <Button size='sm' variant={"outline"} className="w-fit">
                                            <Plus className="mr-2 h-4 w-4" /> {/* Icon for Plus */}
                                            Create Project
                                        </Button>
                                    </Link>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
