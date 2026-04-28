import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://prqrgcstfboexfehpmnt.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycXJnY3N0ZmJvZXhmZWhwbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MjQyODIsImV4cCI6MjA5MjAwMDI4Mn0.cnK1AzYvH6jtvhLAnb8QWhz29j-6Y-d6wC6SgDOpQvg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];

function getISOWeek(date = new Date()) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

export default function App() {
  const [kitaName, setKitaName] = useState("");
  const [ratings, setRatings] = useState({});
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const setDayRating = (day, value) => {
    setRatings((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  const submitFeedback = async () => {
    if (!kitaName.trim()) {
      alert("Bitte Einrichtung eintragen.");
      return;
    }

    if (Object.keys(ratings).length === 0) {
      alert("Bitte mindestens einen Tag bewerten.");
      return;
    }

    setSending(true);

    const { error } = await supabase.from("feedback_entries").insert({
      kita_name: kitaName.trim(),
      ratings,
      comment,
      photo_url: "",
      kw: getISOWeek(),
    });

    setSending(false);

    if (error) {
      alert("Fehler beim Speichern: " + error.message);
      return;
    }

    alert("Feedback gespeichert. Danke!");

    setRatings({});
    setComment("");
  };

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-emerald-100">
        <h1 className="text-3xl font-bold text-slate-900">
          🍽️ Wochenfeedback
        </h1>

        <p className="mt-2 text-slate-500">
          Bitte bewertet die Gerichte der Woche.
        </p>

        <label className="mt-6 block text-sm font-medium text-slate-700">
          Einrichtungsname
          <input
            value={kitaName}
            onChange={(e) => setKitaName(e.target.value)}
            placeholder="z. B. Kita Sonnenschein"
            className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-3 outline-none focus:border-emerald-400"
          />
        </label>

        <div className="mt-6 space-y-3">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4"
            >
              <div className="font-semibold text-slate-900">{day}</div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDayRating(day, "up")}
                  className={`rounded-xl px-4 py-2 text-2xl ${
                    ratings[day] === "up"
                      ? "bg-emerald-500"
                      : "bg-white"
                  }`}
                >
                  👍
                </button>

                <button
                  type="button"
                  onClick={() => setDayRating(day, "down")}
                  className={`rounded-xl px-4 py-2 text-2xl ${
                    ratings[day] === "down"
                      ? "bg-red-400"
                      : "bg-white"
                  }`}
                >
                  👎
                </button>
              </div>
            </div>
          ))}
        </div>

        <textarea
          placeholder="Optionaler Kommentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-6 h-32 w-full rounded-xl border border-emerald-200 p-3 outline-none focus:border-emerald-400"
        />

        <button
          type="button"
          onClick={submitFeedback}
          disabled={sending}
          className="mt-6 w-full rounded-2xl bg-emerald-600 px-6 py-4 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {sending ? "Wird gespeichert..." : "Feedback senden"}
        </button>
      </div>
    </div>
  );
}
