// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    uint256 public totalFunds;
    address public receiver;
    bool public isReleased;

    error alreadyReleased();

    event treasuryInitiated(address indexed receiver, uint256 value);
    event fundsReleased(address indexed to, uint256 amount, uint256 timestamp);

    modifier checkReleased() {
        if (isReleased) {
            revert alreadyReleased();
        }
        _;
    }

    constructor(address _receiver) payable {
        totalFunds = msg.value;
        receiver = _receiver;
        isReleased = false;

        emit treasuryInitiated(receiver, totalFunds);
    }

    function releaseFunds() public onlyOwner checkReleased {
        isReleased = true;
        payable(receiver).transfer(totalFunds);

        emit fundsReleased(receiver, totalFunds, block.timestamp);
    }
}
