import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ListMusic } from "lucide-react";

export default function Library() {
  const navigate = useNavigate();
  return (
    <div className="container max-w-screen-md mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Library</h1>
      <div className="flex flex-col gap-6">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-3 justify-start text-lg"
          onClick={() => navigate("/liked-songs")}
        >
          <Heart className="h-6 w-6 text-pink-600" />
          Liked Songs
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-3 justify-start text-lg"
          onClick={() => navigate("/my-playlists")}
        >
          <ListMusic className="h-6 w-6 text-blue-600" />
          My Playlists
        </Button>
      </div>
    </div>
  );
}
