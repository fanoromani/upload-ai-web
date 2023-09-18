import { FileVideo, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = "waiting" | "converting" | "uploading" | "generating" | "success";
interface VideoInputFormProps {
  onVideoUploaded: (videoID: string) => void;
}

const statusMessages = {
  converting: "Converting...",
  generating: "Generating transcription...",
  uploading: "Uploading...",
  success: "Success!",
};

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("waiting");
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget;

    if (!files) {
      return;
    }
    const selectedFile = files[0];
    setVideoFile(selectedFile);
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = promptInputRef.current?.value;

    if (!videoFile) {
      return;
    }

    setStatus("converting");

    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData();
    data.append("file", audioFile);
    setStatus("uploading");
    const response = await api.post("/videos", data);
    const videoID = response.data.video.id;
    setStatus("generating");
    await api.post(`/videos/${videoID}/transcription`, {
      prompt,
    });
    setStatus("success");
    props.onVideoUploaded(videoID);
  }

  async function convertVideoToAudio(video: File) {
    const ffmpeg = await loadFFmpeg();
    await ffmpeg.writeFile("input.mp4", await fetchFile(video));
    ffmpeg.on("progress", (progress) => {
      console.log(
        "Conversion progress: " + Math.round(progress.progress * 100)
      );
    });
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-map",
      "0:a",
      "-b:a",
      "20k",
      "-acodec",
      "libmp3lame",
      "output.mp3",
    ]);
    const data = await ffmpeg.readFile("output.mp3");
    const audioFileBlob = new Blob([data], { type: "audio/mpeg" });
    const audioFile = new File([audioFileBlob], "audio.mp3", {
      type: "audio/mpeg",
    });
    console.log("Conversion finished.");
    return audioFile;
  }

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null;
    }
    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleUploadVideo} className="space-y-4">
      <label
        htmlFor="video"
        className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="absolute inset-0 pointer-events-none"
          ></video>
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Select video
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />
      <Separator />
      <div className="space-y-2">
        <Label htmlFor="transcription-prompt">Transcription prompt</Label>
        <Textarea
          disabled={status !== "waiting"}
          ref={promptInputRef}
          id="transcription-prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Search for keywords mentioned in the video separated by commas ( , )"
        />
      </div>
      <Button
        data-success={status === "success"}
        disabled={status !== "waiting"}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === "waiting" ? (
          <>
            Upload video
            <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
