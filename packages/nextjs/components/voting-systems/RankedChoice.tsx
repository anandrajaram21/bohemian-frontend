import { useState } from "react";
import sha256 from "crypto-js/sha256";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { parseEther } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type Candidate = {
  id: number;
  name: string;
  votes: number;
};

type RankedChoiceVotingProps = {
  candidates: Candidate[];
  electionId: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MIN_BALANCE = parseEther("0.01"); // Set minimum balance required for gas fees

export default function RankedChoiceVoting({ candidates, electionId }: RankedChoiceVotingProps) {
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { writeContractAsync: writeVotingSystemAsync } = useScaffoldWriteContract("VotingSystem");

  // Wagmi hooks for account and balance
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const hasSufficientBalance = balanceData ? (balanceData.value >= MIN_BALANCE ? true : false) : false;

  // Helper to handle the ranking order
  const handleCandidateSelect = (candidate: Candidate) => {
    if (rankedCandidates.includes(candidate)) {
      setRankedCandidates(rankedCandidates.filter(c => c.id !== candidate.id));
    } else {
      setRankedCandidates([...rankedCandidates, candidate]);
    }
  };

  const openModal = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet.");
      return;
    }
    if (!hasSufficientBalance) {
      toast.error("Insufficient funds for gas fees. Please ensure you have at least 0.01 ETH.");
      return;
    }
    if (rankedCandidates.length < 2) {
      toast.error("Please select at least two candidates in your preferred order.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail("");
    setOtp("");
  };

  const handleVote = async () => {
    if (!email || !otp) {
      toast.error("Please enter both email and OTP.");
      return;
    }

    setLoading(true);
    try {
      const authorizationHash = sha256(email + otp).toString();
      // Use rankedCandidates and make a JSON object with the following format {candidateId: rank}
      // Fix the type error below
      const voteData = rankedCandidates.reduce((acc: { [key: number]: number }, candidate) => {
        acc[candidate.id] = rankedCandidates.indexOf(candidate) + 1;
        return acc;
      }, {});
      const body = JSON.stringify({ vote: JSON.stringify(voteData) });
      console.log(body);

      // Send the vote with the authorization header
      const response = await fetch(`${API_URL}/elections/${electionId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authorizationHash}`,
        },
        body,
      });

      if (response.ok) {
        try {
          const electionIdNumber = BigInt(electionId);
          const result = await writeVotingSystemAsync({
            functionName: "recordVote",
            args: [electionIdNumber, authorizationHash, body],
          });
          console.log(result);
          toast.success("Vote recorded successfully!");
          closeModal();
          window.location.reload();
        } catch (e) {
          toast.error("Failed to submit vote on-chain. Please try again.");
          console.error(e);
        }
      } else {
        console.error("Failed to submit vote to backend");
        toast.error("Failed to submit vote. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-base-100 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4">Ranked Choice Voting</h3>

      {/* Instructions */}
      <p className="text-center mb-6 text-sm text-gray-500">
        Select candidates in order of preference by clicking on them. The selected order represents your ranked choices.
        Click Submit Ranked Vote when you are ready to confirm your selection.
      </p>

      <ul className="space-y-4">
        {candidates.map(candidate => (
          <li
            key={candidate.id}
            className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition ${
              rankedCandidates.includes(candidate) ? "bg-secondary text-white" : "bg-base-200"
            }`}
            onClick={() => handleCandidateSelect(candidate)}
          >
            <span className="text-lg font-medium mr-3">{rankedCandidates.indexOf(candidate) + 1 || "-"}</span>
            <span>{candidate.name}</span>
          </li>
        ))}
      </ul>

      <button onClick={openModal} className="btn btn-primary w-full mt-6">
        Submit Ranked Vote
      </button>

      {/* Modal for Email and OTP Confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Confirm Vote"
        ariaHideApp={false}
      >
        <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">Confirm Your Ranked Vote</h3>

          {/* Show selected candidate rankings */}
          <p className="text-center mb-4">You are voting with the following ranking:</p>
          <ul className="mb-4 space-y-2">
            {rankedCandidates.map((candidate, index) => (
              <li key={candidate.id} className="text-center text-base font-semibold">
                {index + 1}. {candidate.name}
              </li>
            ))}
          </ul>

          {/* Email Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* OTP Input */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">OTP</span>
            </label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter OTP"
              required
            />
          </div>

          {/* Confirm and Close Buttons */}
          <button
            onClick={handleVote}
            className={`btn btn-primary w-full mt-2 ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Confirm Vote"}
          </button>
          <button onClick={closeModal} className="btn btn-secondary w-full mt-2">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
