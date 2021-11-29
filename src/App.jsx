import { useRef, useState } from "react";
import ChordPicker from "./_components/ChordPicker";
import { Chord } from "@tonaljs/tonal";
import SheetMusic from "./_components/SheetMusic";
import { generateMelody } from "./_utilities";

export default function App() {
  const form = useRef(null);
  const [numChords, setnumChords] = useState(1);
  const [melody, setMelody] = useState([]);

  function handleForm(e) {
    e.preventDefault();
    let data = new FormData(form.current);
    let chords = Array.from(data.entries())
      .reduce((arr, [key, value]) => {
        let [type, i] = key.split("_");
        if (arr[i - 1] === undefined) arr[i - 1] = {};
        arr[i - 1][type] = value;
        return arr;
      }, [])
      .map((c) => ({
        chord: Chord.get(c.chord),
        duration: c.duration * 4,
      }));
    if (chords.find(({ chord }) => chord.empty) != undefined)
      alert("Invalid Chord Symbol!");
    else setMelody(generateMelody(chords));
  }

  return (
    <>
      <form ref={form} onSubmit={handleForm}>
        <div className="chords">
          {Array(numChords)
            .fill("")
            .map((el, i) => (
              <ChordPicker key={i} id={i + 1} />
            ))}
          <button
            onClick={() => {
              setnumChords(numChords + 1);
            }}
            id="addChord"
            type="button"
          >
            +
          </button>
        </div>
        <button id="goBtn">Go!</button>
      </form>
      <SheetMusic melody={melody} />
    </>
  );
}
