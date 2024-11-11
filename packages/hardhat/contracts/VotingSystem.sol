// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSystem {
    struct Vote {
        string authorizationString; // SHA-256 hash of email + OTP
        string voteData; // JSON stringified data containing the vote information
    }

    // Array to store all votes
    Vote[] private votes;

    // Event to emit when a new vote is recorded
    event VoteRecorded(string indexed authorizationString, string voteData);

    // Function to record a new vote
    function recordVote(string calldata _authorizationString, string calldata _voteData) external {
        // Store the vote
        votes.push(Vote({
            authorizationString: _authorizationString,
            voteData: _voteData
        }));

        // Emit the vote recorded event
        emit VoteRecorded(_authorizationString, _voteData);
    }

    // Function to get the total number of votes
    function getVoteCount() external view returns (uint256) {
        return votes.length;
    }

    // Function to retrieve a specific vote by index
    function getVote(uint256 index) external view returns (string memory, string memory) {
        require(index < votes.length, "Index out of bounds.");
        Vote memory vote = votes[index];
        return (vote.authorizationString, vote.voteData);
    }

    // Function to retrieve all votes (useful for testing, avoid on large data)
    function getAllVotes() external view returns (Vote[] memory) {
        return votes;
    }
}
