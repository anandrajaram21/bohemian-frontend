"use client";

import { useState } from "react";
import sha256 from "crypto-js/sha256";
import toast from "react-hot-toast";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyVotesPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [electionId, setElectionId] = useState("");
  const [dbVoteData, setDbVoteData] = useState<string | null>(null);
  const [chainVoteData, setChainVoteData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch votes from blockchain using scaffold read contract hook
  const { data: blockchainVotes } = useScaffoldReadContract({
    contractName: "VotingSystem",
    functionName: "getVotesByElectionId",
    args: [BigInt(electionId)],
  });

  // Fetch vote from database API
  const fetchDbVote = async (authorizationHash: string) => {
    try {
      const response = await fetch(`${API_URL}/elections/${electionId}/all_votes`);
      if (!response.ok) throw new Error("Failed to fetch votes from database.");
      const data = await response.json();

      // Retrieve vote data for the specific authorization hash
      const voteData = data.votes[authorizationHash] || null;
      return voteData;
    } catch (error) {
      console.error("Error fetching DB vote:", error);
      toast.error("Error fetching DB vote. Please try again.");
      return null;
    }
  };

  // Fetch vote from blockchain
  const fetchChainVote = (authorizationHash: string) => {
    if (!blockchainVotes) return null;

    // Find the vote with the matching authorization hash
    const matchedVote = blockchainVotes.find(
      (vote: { authorizationString: string }) => vote.authorizationString === authorizationHash,
    );

    return matchedVote ? matchedVote.voteData : null;
  };

  const verifyVotes = async () => {
    if (!email || !otp || !electionId) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const authorizationHash = sha256(email + otp).toString();

      // Fetch vote data from the database and blockchain
      const dbVote = await fetchDbVote(authorizationHash);
      const chainVote = fetchChainVote(authorizationHash);

      if (dbVote || chainVote) {
        setDbVoteData(dbVote);
        setChainVoteData(chainVote);
        toast.success("Vote verification completed.");
      } else {
        toast.error("No matching votes found in either source.");
      }
    } catch (error) {
      console.error("Error verifying votes:", error);
      toast.error("Error verifying votes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-base-200">
      <h2 className="text-2xl font-bold mb-4">Verify Election Votes</h2>
      <div className="w-full max-w-md bg-base-100 p-6 rounded-lg shadow-lg space-y-4">
        {/* Email Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter your email"
          />
        </div>

        {/* OTP Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">OTP</span>
          </label>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter OTP"
          />
        </div>

        {/* Election ID Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Election ID</span>
          </label>
          <input
            type="text"
            value={electionId}
            onChange={e => setElectionId(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Enter Election ID"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={verifyVotes}
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Fetch and Verify Votes"}
        </button>
      </div>

      {/* Display Comparison */}
      {(dbVoteData || chainVoteData) && (
        <div className="w-full max-w-2xl bg-base-100 p-6 mt-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Vote Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* DB Vote Display */}
            <div className="border p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Database Vote</h4>
              {dbVoteData ? (
                <p>
                  <strong>Vote Data:</strong> {dbVoteData}
                </p>
              ) : (
                <p>No matching vote found in database.</p>
              )}
            </div>

            {/* Blockchain Vote Display */}
            <div className="border p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Blockchain Vote</h4>
              {chainVoteData ? (
                <p>
                  <strong>Vote Data:</strong> {chainVoteData}
                </p>
              ) : (
                <p>No matching vote found on blockchain.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
