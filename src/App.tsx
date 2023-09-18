import { Github, Wand2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { VideoInputForm } from "./components/video-input-form";
import { PromptSelect } from "./components/prompt-select";
import { useState } from "react";
import { useCompletion } from "ai/react";

export function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoID, setVideoID] = useState<string | null>(null);

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: "http://localhost:3333/ai/complete",
    body: {
      videoID,
      temperature,
    },
    headers: {
      "Content-type": "application/json",
    },
  });
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Developed by{" "}
            <a
              className="text-primary hover:text-primary/80 transition"
              href="https://fanoromani.netlify.app"
              target="_blank"
            >
              @fanoromani
            </a>
          </span>
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
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Results"
              readOnly
              value={completion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Remember you can use the variable{" "}
            <code className="text-violet-400">{"{transcription}"}</code> on your
            prompt to add the content of the transcription of the selected video
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoID} />
          <Separator />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>
            <div className="space-y-2">
              <Label>Model</Label>
              <Select disabled defaultValue="gpt-3.5">
                <SelectTrigger>
                  <SelectValue></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                You'll be able to customize this option soon
              </span>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Temperature</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Higher values tend to give more creative results, with
                occasional errors.
              </span>
            </div>
            <Separator />
            <Button disabled={isLoading} type="submit" className="w-full">
              Run
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
