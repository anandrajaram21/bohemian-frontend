"use client";

import { useState } from "react";

export default function View() {
  const [electionId, setElectionId] = useState<string>("");
  return (
    <div>
      <input type="text" value={electionId} onChange={e => setElectionId(e.target.value)} />
      <button onClick={() => (window.location.href = `/election/${electionId}`)}>Go</button>
    </div>
  );
}
