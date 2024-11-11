"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function View() {
  const router = useRouter();
  const [electionId, setElectionId] = useState<string>("");

  const handleViewElection = () => {
    if (!electionId) {
      toast.error("Please enter an election ID.");
      return;
    }
    router.push(`/election/${electionId}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 p-8">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-1 text-primary hover:text-primary-focus"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-base-100 p-8 rounded-lg shadow-lg space-y-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-4">View Election</h2>

        {/* Election ID Input */}
        <div className="form-control">
          <label htmlFor="electionId" className="label">
            <span className="label-text">Enter Election ID</span>
          </label>
          <input
            type="text"
            id="electionId"
            value={electionId}
            onChange={e => setElectionId(e.target.value)}
            placeholder="e.g., 12345"
            className="input input-bordered w-full"
          />
        </div>

        {/* Go Button */}
        <button onClick={handleViewElection} className="btn btn-primary w-full">
          Go to Election
        </button>
      </div>
    </div>
  );
}
