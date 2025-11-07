import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  voice,
} from "@livekit/agents";
import * as livekit from "@livekit/agents-plugin-livekit";
import * as silero from "@livekit/agents-plugin-silero";
import { BackgroundVoiceCancellation } from "@livekit/noise-cancellation-node";
import { fileURLToPath } from "node:url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Function to generate Tavus avatar video from text
// async function generateAvatarVideo(text: string): Promise<string | null> {
//   try {
//     const res = await axios.post(
//       "https://api.tavus.io/v2/generate",
//       {
//         script: text,
//         avatar_id: process.env.TAVUS_AVATAR_ID,
//         voice_id: process.env.TAVUS_VOICE_ID,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.TAVUS_API_KEY}`,
//         },
//       }
//     );

//     if (res.data.video_url) {
//       console.log("🎥 Tavus avatar video ready:", res.data.video_url);
//       return res.data.video_url;
//     } else {
//       console.error("No video URL returned:", res.data);
//       return null;
//     }
//   } catch (err) {
//     console.error("❌ Tavus API error:", err);
//     return null;
//   }
// }
// async function translateText(text: string, targetLang: string) {
//   try {
//     const result = await translate(text, { to: targetLang });
//     return result.text;
//   } catch (err) {
//     console.error("Translation error:", err);
//     return text;
//   }
// }

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },

  entry: async (ctx: JobContext) => {
    const vad = ctx.proc.userData.vad! as silero.VAD;

    const assistant = new voice.Agent({
      instructions: `
          You are MediVoice AI, a friendly and professional voice AI assistant.
          - Assist users with symptoms, health guidance, and appointment scheduling.
          - Include working hours (Monday to Friday, 9 AM – 6 PM) only when the user wants to schedule an appointment.
          - Respond naturally for voice and avatar video output.
          - Keep answers concise, empathetic, and clear.
        `,
    });

    const session = new voice.AgentSession({
      vad,
      stt: "openai/whisper-1",
      llm: "openai/gpt-4.1-mini",
      tts: "cartesia/sonic-3:9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
      turnDetection: new livekit.turnDetector.MultilingualModel(),
    });

    await session.start({
      agent: assistant,
      room: ctx.room,
      inputOptions: {
        noiseCancellation: BackgroundVoiceCancellation(),
      },
    });

    await ctx.connect();

    const greeting = await session.generateReply({
      instructions: "Greet the user and offer your assistance.",
    });

    const greetingText =
      "Hello! I'm MediVoice AI, your personal medical assistant. How can I help you today?";
    await session.say(greetingText);

    // const avatarVideoUrl = await generateAvatarVideo(greetingText);
    // if (avatarVideoUrl) {
    //   console.log("✅ Avatar video URL:", avatarVideoUrl);

    // }
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
