import { useState } from "react";

export default function App() {
  const [rating, setRating] = useState(null);
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">
        🍽️ Feedback abgeben
      </h1>

      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setRating("up")}
          className={`text-4xl ${rating === "up" ? "scale-125" : ""}`}
        >
          👍
        </button>

        <button
          onClick={() => setRating("down")}
          className={`text-4xl ${rating === "down" ? "scale-125" : ""}`}
        >
          👎
        </button>
      </div>

      <textarea
        placeholder="Optionaler Kommentar..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-md p-3 rounded-xl border mb-4"
      />

      <button
        onClick={() => {
          alert("Feedback gespeichert (Demo)");
        }}
        className="bg-emerald-600 text-white px-6 py-3 rounded-xl"
      >
        Speichern
      </button>
    </div>
  );
}
