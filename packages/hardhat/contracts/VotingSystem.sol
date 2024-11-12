// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Vote {
        uint256 electionId; // ID of the election
        string authorizationString; // SHA-256 hash of email + OTP
        string voteData; // JSON stringified data containing the vote information
    }

    // Array to store all votes
    Vote[] private votes;

    // Event to emit when a new vote is recorded
    event VoteRecorded(uint256 electionId, string indexed authorizationString, string voteData);

    // Function to record a new vote
    function recordVote(uint256 _electionId, string calldata _authorizationString, string calldata _voteData) external {
        // Store the vote
        votes.push(Vote({
            electionId: _electionId,
            authorizationString: _authorizationString,
            voteData: _voteData
        }));

        // Emit the vote recorded event
        emit VoteRecorded(_electionId, _authorizationString, _voteData);
    }

    // Function to get the total number of votes
    function getVoteCount() external view returns (uint256) {
        return votes.length;
    }

    // Function to retrieve a specific vote by index
    function getVote(uint256 index) external view returns (uint256, string memory, string memory) {
        require(index < votes.length, "Index out of bounds.");
        Vote memory vote = votes[index];
        return (vote.electionId, vote.authorizationString, vote.voteData);
    }

    // Function to retrieve all votes of a particular electionId
    function getVotesByElectionId(uint256 _electionId) external view returns (Vote[] memory) {
        // First, count the number of votes for the specified electionId
        uint256 count = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].electionId == _electionId) {
                count++;
            }
        }

        // Create an array to hold the votes of the specified electionId
        Vote[] memory electionVotes = new Vote[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i].electionId == _electionId) {
                electionVotes[index] = votes[i];
                index++;
            }
        }

        return electionVotes;
    }
}
