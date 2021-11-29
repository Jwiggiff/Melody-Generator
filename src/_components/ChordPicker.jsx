export default function ChordPicker(props) {
  return (
    <div className="chordPicker">
      <input name={"chord_" + props.id} type="text" placeholder="Chord" />
      <input
        type="number"
        name={"duration_" + props.id}
        min="0.5"
        max="4"
        step="0.5"
        placeholder="Duration"
      />
    </div>
  );
}
