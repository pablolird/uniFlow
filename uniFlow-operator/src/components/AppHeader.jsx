import { LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useRequestState } from "../context/RequestContext";
import { WifiOff, Wifi } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

export default function AppHeader() {
  const { isSocketConnected } = useRequestState();
  const { logout, isAuthLoading } = useAuth();

  const handleClick = async () => {
    await logout();
  };

  return (
    <header className="flex justify-between relative items-center bg-card p-3 border-b border-stone-300">
      <div className="flex gap-1 p-1 bottom-0 left-0">
        {isSocketConnected ? (
          <>
            <Wifi className="text-green-500 animate-blink" />
            <p className="text-green-500 animate-blink">Connected</p>
          </>
        ) : (
          <>
            <WifiOff className="text-red-500 animate-blink" />
            <p className="text-red-500 animate-blink">Disconnected</p>
          </>
        )}
      </div>

      <div className="text-2xl absolute right-1/2 translate-x-1/2 text-foreground font-semibold text-center shrink-0">
        <span className="text-primary">uni</span>Flow
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full border">
            <Avatar>
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-2">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuItem className="" onClick={handleClick}>
              <LogOut className="text-red-500" />
              <span className="text-red-500">
                {isAuthLoading ? <Spinner /> : "Logout"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
