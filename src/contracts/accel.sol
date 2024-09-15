// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MultiDAO {

    struct Option {
        string description;
        uint voteCount;
    }

    struct Proposal {
        string description;
        mapping(uint => Option) options; 
        bool executed;
        uint deadline;
        uint totalVotes;
        uint winningOptionId; 
    }

    struct DAO {
        string name;
        address admin;
        uint proposalCount;
        mapping(address => bool) members;  
        mapping(uint => Proposal) proposals; 
        mapping(uint => mapping(address => bool)) voters;  
    }

    mapping(uint => DAO) public daos;  
    uint public daoCount;  
    
    event DAOCreated(uint daoId, string name, address admin);
    event ProposalCreated(uint daoId, uint proposalId, string description, uint deadline);
    event Voted(uint daoId, uint proposalId, address voter);
    event ProposalExecuted(uint daoId, uint proposalId, string winningOptionDescription );

    modifier onlyAdmin(uint daoId) {
        require(msg.sender == daos[daoId].admin, "Only DAO admin can call");
        _;
    }

    modifier onlyMembers(uint daoId) {
        require(daos[daoId].members[msg.sender], "Only DAO memberse");
        _;
    }

    modifier activeProposal(uint daoId, uint proposalId) {
        require(daos[daoId].proposals[proposalId].deadline > block.timestamp, "Voting period ended");
        _;
    }

    function createDAO(string memory _name) public {
        try this.getDAOIdByName(_name) {
            revert("DAO with this name already exists");
        } catch {
            DAO storage newDAO = daos[daoCount];
            newDAO.name = _name;
            newDAO.admin = msg.sender;
            newDAO.members[msg.sender] = true; 
            
            emit DAOCreated(daoCount, _name, msg.sender);
            daoCount++;
        }
    }

    function addMember(uint daoId, address _member) public onlyAdmin(daoId) {
        daos[daoId].members[_member] = true;
    }

    function removeMember(uint daoId, address _member) public onlyAdmin(daoId) {
        require(daos[daoId].members[_member], "Member does not exist");
        daos[daoId].members[_member] = false;
    }

    function createProposal(uint daoId, string memory _description, string[] memory _optionDescriptions, uint _votingDuration) public onlyAdmin(daoId) {
        DAO storage dao = daos[daoId];
        require(_optionDescriptions.length > 0, "Proposal must have at least one option");

        uint proposalId = dao.proposalCount++;
        uint deadline = block.timestamp + _votingDuration;

        Proposal storage proposal = dao.proposals[proposalId];
        
        proposal.description = _description;
        proposal.deadline = deadline;
        proposal.totalVotes = 0;
        proposal.winningOptionId = 0;

        for (uint i = 0; i < _optionDescriptions.length; i++) {
            proposal.options[i] = Option({
                description: _optionDescriptions[i],
                voteCount: 0
            });
        }
        emit ProposalCreated(daoId, proposalId, _description, deadline);
    }


    function vote(uint daoId, uint proposalId, uint optionId) public onlyMembers(daoId) activeProposal(daoId, proposalId) {
        DAO storage dao = daos[daoId];
        Proposal storage proposal = dao.proposals[proposalId];
        require(!dao.voters[proposalId][msg.sender], "Already voted");

        dao.voters[proposalId][msg.sender] = true;
        proposal.options[optionId].voteCount += 1;
        proposal.totalVotes += 1;

        emit Voted(daoId, proposalId, msg.sender);
    }

    function executeProposal(uint daoId, uint proposalId) public onlyAdmin(daoId) {
        DAO storage dao = daos[daoId];
        Proposal storage proposal = dao.proposals[proposalId];
        require(proposal.totalVotes > 0, "No votes received");
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp >= proposal.deadline, "Voting period still active");

        uint winningOptionId = 0;
        uint highestVoteCount = 0;

        for (uint i = 0; i < dao.proposalCount; i++) {
            if (proposal.options[i].voteCount > highestVoteCount) {
                highestVoteCount = proposal.options[i].voteCount;
                winningOptionId = i;
            }
        }

        proposal.winningOptionId = winningOptionId;
        proposal.executed = true;

        emit ProposalExecuted(daoId, proposalId, proposal.options[winningOptionId].description);
    }

    function getProposal(uint daoId, uint proposalId) public view returns (string memory description, string[] memory optionDescriptions, uint[] memory optionVoteCounts, bool executed, uint deadline, uint totalVotes) {
        Proposal storage proposal = daos[daoId].proposals[proposalId];
        uint optionCount = daos[daoId].proposalCount;
        
        string[] memory optionDesc = new string[](optionCount);
        uint[] memory optionVotes = new uint[](optionCount);
        
        for (uint i = 0; i < optionCount; i++) {
            optionDesc[i] = proposal.options[i].description;
            optionVotes[i] = proposal.options[i].voteCount;
        }

        return (proposal.description, optionDesc, optionVotes, proposal.executed, proposal.deadline, proposal.totalVotes);
    }

    function hasVoted(uint daoId, uint proposalId, address voter) public view returns (bool) {
        return daos[daoId].voters[proposalId][voter];
    }

    function getDAOIdByName(string memory _name) public view returns (uint) {
        for (uint i = 0; i < daoCount; i++) {
            if (keccak256(abi.encodePacked(daos[i].name)) == keccak256(abi.encodePacked(_name))) {
                return i;  
            }
        }
        revert("DAO with this name does not exist");
    }

    function getDAOCount() public view returns (uint) {
        return daoCount;
    }

    function returnDaoName(uint _id) public view returns (string memory) {
        require(_id<daoCount);
        
        return daos[_id].name;
    }

    function getDAOsForSender_admin() public view returns (uint[] memory) {
        uint count = 0;

        for (uint i = 0; i < daoCount; i++) {
            if (daos[i].admin == msg.sender) {
                count++;
            }
        }

        uint[] memory daoIds = new uint[](count);
        uint index = 0;

        for (uint i = 0; i < daoCount; i++) {
            if (daos[i].admin == msg.sender) {
                daoIds[index] = i;
                index++;
            }
        }

        return daoIds;
    }

    function getDAOsForSender_member() public view returns (uint[] memory) {
        uint count = 0;

        for (uint i = 0; i < daoCount; i++) {
            if (daos[i].members[msg.sender] && daos[i].admin != msg.sender) {
                count++;
            }
        }

        uint[] memory daoIds = new uint[](count);
        uint index = 0;

        for (uint i = 0; i < daoCount; i++) {
            if (daos[i].members[msg.sender] && daos[i].admin != msg.sender) {
                daoIds[index] = i;
                index++;
            }
        }

        return daoIds;
    }



}
