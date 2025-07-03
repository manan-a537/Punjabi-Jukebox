import { usePlaylistContext } from "@/context/PlaylistContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { 
  Home, Search, Library, Heart,
  ChevronRight, ChevronLeft, Download, User, UserPlus, Plus
} from "lucide-react";
import { CreatePlaylistDialog } from "@/components/CreatePlaylistDialog";

interface SidebarProps {
  className?: string;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ className, collapsed, setCollapsed }: SidebarProps) => {
  const { playlists, createPlaylist } = usePlaylistContext();
  const navigate = useNavigate();
  
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]",
        "min-h-screen h-full pb-28", // Add pb-28 to match the music player height
        className
      )}
    >
      <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden no-scrollbar p-3">
        {/* Logo & Collapse Button */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold">PJ</span>
              </div>
              <span className="font-display font-semibold">PunjabiJukebox</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto bg-primary w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">PJ</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground p-1 rounded-full"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Main Navigation */}
        <nav className="space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            <Home className="h-5 w-5" />
            {!collapsed && <span>Home</span>}
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            <Search className="h-5 w-5" />
            {!collapsed && <span>Search</span>}
          </Link>
          <Link
            to="/library"
            className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            <Library className="h-5 w-5" />
            {!collapsed && <span>Your Library</span>}
          </Link>
          <Link
            to="/liked-songs"
            className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            <Heart className="h-5 w-5" />
            {!collapsed && <span>Liked Songs</span>}
          </Link>
        </nav>
        
        <Separator className="my-6 bg-sidebar-foreground/10" />
        
        {/* Playlists */}
        {!collapsed && (
          <div className="flex-grow">
            <div className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/70 mb-3">
              Playlists
            </div>
            <div className="flex-1 px-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                  Your Playlists
                </h2>
                {playlists.map((playlist) => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                  >
                    {playlist.name}
                    <span className="text-xs text-muted-foreground">
                      ({playlist.songCount})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* User Actions */}
        <div className="mt-auto space-y-1">
          <SidebarItem icon={<Download />} label="Install App" collapsed={collapsed} />
          <SidebarItem icon={<User />} label="Account" collapsed={collapsed} />
        </div>
      </div>

      {/* Restore CreatePlaylistDialog at the bottom */}
      <div className="px-6 pt-4 border-t border-border">
        <CreatePlaylistDialog
          onCreatePlaylist={createPlaylist}
          // @ts-ignore
          triggerButton={
            <Button variant="outline" className="w-full flex items-center justify-center">
              <Plus className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Create Playlist</span>}
            </Button>
          }
          collapsed={collapsed}
        />
      </div>
      <div className="p-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => navigate("/signup")}
        >
          <UserPlus className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Create Account</span>}
        </Button>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon, label, active, collapsed }: SidebarItemProps) => {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-3 py-2 px-3 text-sm font-medium rounded-md transition-colors",
        active 
          ? "text-sidebar-foreground bg-sidebar-accent"
          : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </a>
  );
};

export default Sidebar;
