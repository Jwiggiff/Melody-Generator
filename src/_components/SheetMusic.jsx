import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Part } from "tone";
import Vex from "vexflow";
import { createPartArray } from "../_utilities";
import { PlayIcon, StopIcon } from "./Icons";

export default function SheetMusic(props) {
  // const synth = new Tone.Synth().toDestination();
  const synth = new Tone.Sampler({
    urls: {
      C5: "Keys.wav",
    },
  }).toDestination();
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPart, setAudioPart] = useState(null);

  // Generate sheet music
  useEffect(() => {
    if (props.melody.length > 0) {
      ref.current.innerHTML = "";

      const vf = new Vex.Flow.Factory({
        renderer: { elementId: "sheetMusic", width: 500, height: 150 },
      });
      const score = vf.EasyScore();
      const system = vf.System();

      let melody = props.melody.reduce((melody, { note, duration }) => {
        melody += note + "5/" + duration + ", ";
        return melody;
      }, "");
      melody = melody.slice(0, melody.length - 2);

      system
        .addStave({
          voices: [score.voice(score.notes(melody))],
        })
        .addClef("treble")
        .addTimeSignature("4/4");

      vf.draw();
    }
  });

  // Generate audio part
  useEffect(() => {
    if (props.melody.length > 0) {
      let notes = createPartArray(props.melody);
      let part = new Tone.Part((time, { note, duration }) => {
        synth.triggerAttackRelease(note, duration, time);
      }, notes);
      setAudioPart(part);

      return () => {
        part.dispose();
      };
    }
  }, [props]);

  async function play() {
    await Tone.start();

    if (isPlaying) {
      setIsPlaying(false);
      Tone.Transport.stop();
      return;
    }
    setIsPlaying(true);

    audioPart.start();
    Tone.Transport.start();
  }

  return (
    <div className="display">
      <div id="sheetMusic" ref={ref}></div>
      <button onClick={play}>{isPlaying ? <StopIcon /> : <PlayIcon />}</button>
    </div>
  );
}
