import { Github } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Made with love</span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant={"outline"}>
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Insert prompt"
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Results"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Remember you can use the variable{" "}
            <code className="text-violet-400">{"{transcription}"}</code> on your
            prompt to add the content of the transcription of the selected video
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary"
            >
              Upload video
            </label>
            <input
              type="file"
              id="video"
              accept="video/mp4"
              className="sr-only"
            />
          </form>
        </aside>
      </main>
    </div>
  );
}
