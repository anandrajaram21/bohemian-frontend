import { useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";

type Candidate = {
  id: number;
  name: string;
  votes: number;
};

type TraditionalVotingProps = {
  candidates: Candidate[];
};

export default function TraditionalVoting({ candidates }: TraditionalVotingProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Function to get the selected candidate's name
  const getSelectedCandidateName = () => {
    const candidate = candidates.find(c => c.id === selectedCandidate);
    return candidate ? candidate.name : "Unknown Candidate";
  };

  const openModal = () => {
    if (selectedCandidate === null) {
      toast.error("Please select a candidate to vote for.");
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
      console.log(email, otp, selectedCandidate);
      // TODO: Implement Traditional Voting API call
      toast.success("Vote submitted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Failed to submit vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-base-100 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-center mb-4">Traditional Voting</h3>
      <ul className="space-y-4">
        {candidates.map(candidate => (
          <li key={candidate.id} className="flex items-center">
            <input
              type="radio"
              name="candidate"
              value={candidate.id}
              id={`candidate-${candidate.id}`}
              checked={selectedCandidate === candidate.id}
              onChange={() => setSelectedCandidate(candidate.id)}
              className="radio radio-primary mr-2"
            />
            <label htmlFor={`candidate-${candidate.id}`} className="text-lg font-medium">
              {candidate.name}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={openModal} className="btn btn-primary w-full mt-4">
        Submit Vote
      </button>

      {/* Modal for Email and OTP Confirmation */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Confirm Vote"
      >
        <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">Confirm Your Vote</h3>

          {/* Show selected candidate name */}
          <p className="text-center mb-4">
            You are voting for: <strong>{getSelectedCandidateName()}</strong>
          </p>

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
