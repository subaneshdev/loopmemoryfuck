import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Install LoopMemory MCP Node",
    description: "Connect your local AI environment to LoopMemory. Follow the guide to generate your secure token and run the MCP server.",
};

export default function InstallLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
