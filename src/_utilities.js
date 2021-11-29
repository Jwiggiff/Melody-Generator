const DURATIONS = {
  16: "w",
  8: "h",
  4: "q",
  2: "8",
  1: "16",
};

const AUDIO_DURATIONS = {
  16: "1n",
  8: "2n",
  4: "4n",
  2: "8n",
  1: "16n",
};

export function generateMelody(chords) {
  let melody = [];
  let i = 0,
    d = 0;
  while (d < 16) {
    let duration = parseInt(
      Object.keys(DURATIONS)[
        Math.floor(Math.random() * Object.keys(DURATIONS).length)
      ]
    );
    if (d + duration > 16) continue;
    let sum = 0;
    let chord;
    for (let i = 0; i < chords.length; i++) {
      sum += chords[i].duration;
      if (sum > d) {
        chord = chords[i];
        break;
      }
    }
    chord = chord.chord;
    melody.push({
      note: chord.notes[Math.floor(Math.random() * chord.notes.length)],
      duration: DURATIONS[duration],
    });
    d += parseInt(duration);
    i++;
  }
  return melody;
}

export function createPartArray(notes) {
  notes = notes.map(({ note, duration }) => {
    return {
      note: note + "4",
      duration: Object.keys(DURATIONS).find(
        (key) => DURATIONS[key] == duration
      ),
    };
  });
  for (let i = 0; i < notes.length; i++) {
    let time =
      i > 0
        ? notes
            .slice(0, i)
            .reduce((sum, note) => (sum += parseInt(note.duration)), 0)
        : 0;
    let timeStr = `${Math.floor(time / 16)}:${Math.floor(
      Math.floor(time % 16) / 4
    )}:${(time % 16) % 4}`;
    notes[i].time = timeStr;
  }
  notes = notes.map((note) => {
    note.duration = AUDIO_DURATIONS[note.duration];
    return note;
  });
  return notes;
}
