"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Traditional from "~~/components/voting-systems/Traditional";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define types for results and winner data
interface Result {
  id: number;
  name: string;
  votes: number;
}

interface Winner {
  id: number;
  name: string;
  votes: number;
}

export default function ElectionPage() {
  const router = useRouter();
  const params = useParams();
  const electionId = params?.electionId;
  const [results, setResults] = useState<Result[]>([]);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [votingSystem, setVotingSystem] = useState("");

  // Fetch election results when electionId is available
  useEffect(() => {
    if (!electionId) {
      console.error("Election ID is undefined.");
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_URL}/elections/${electionId}/results`);
        if (!response.ok) throw new Error("Failed to fetch results.");
        const data = await response.json();
        setResults(data.results);
        setWinner(data.winner);
        setIsDraw(data.is_draw);
        setVotingSystem(data.voting_system);
        console.log(data);
      } catch (error) {
        toast.error("Error fetching election results.");
        console.error(error);
      }
    };

    fetchResults();
  }, [electionId]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-base-200 p-8 space-y-6">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => router.push("/")}
          className="flex items-center space-x-1 text-primary hover:text-primary-focus"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to Home</span>
        </button>
      </div>

      <h2 className="text-3xl font-bold text-primary">Election Results</h2>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Results Section */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-center">Results</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="votes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          {winner && (
            <p className="text-center text-lg font-semibold text-green-600">
              Winner: {isDraw ? "It's a draw!" : `${winner.name} with ${winner.votes} votes`}
            </p>
          )}
        </div>

        {/* Cast Your Vote Section */}
        <div className="bg-base-100 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-center">Cast Your Vote</h3>
          <div className="flex flex-col items-center">
            {/* Placeholder for different voting UIs */}
            <p>Select your candidate and click the Vote button</p>
            {votingSystem === "traditional" ? <Traditional candidates={results} /> : <></>}
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
    </div>
  );
}
