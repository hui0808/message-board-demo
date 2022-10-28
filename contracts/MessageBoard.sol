// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "hardhat/console.sol";
contract MessageBoard {
    struct Message {
        // 留言数据结构
        uint id;
        address author;
        string msg;
        uint timestamp;
        bool deleted;
    }
    Message[] data; // 存储留言信息
    uint ids = 0;
    uint public a = 1;
    event MessageUpdated();

    function saveMessage(string memory message) external {
        data.push(Message({id: ids++, author: msg.sender, msg: message, timestamp: block.timestamp, deleted: false}));
        emit MessageUpdated();
    }

    function deleteMessage(uint messageId) public {
        require(messageId < ids, "the message does not exist!");
        Message memory message = data[messageId];
        require(msg.sender == message.author, "you hava no right to delete it!");
        require(message.deleted == false, "the message does not exist!");
        data[messageId].deleted = true;
        emit MessageUpdated();
    }

    function getAllMessage() public view returns(Message[] memory) {
        Message[] memory ret = new Message[](getMessageCount());
        uint count = 0;
        for (uint index = 0; index < data.length; index++) {
            if (data[index].deleted == false) {
                ret[count++] = data[index];
            }
        }
        return ret;
    }

    function getMessageById(uint messageId) public view returns(Message memory) {
        require(messageId < ids, "the message does not exist!");
        require(data[messageId].deleted == false, "the message does not exist!");
        return data[messageId];
    }

    function getMessageCount() public view returns(uint) {
        uint ret = 0;
        for (uint index = 0; index < data.length; index++) {
            if (data[index].deleted == false) {
                ret++;
            }
        }
        return ret;
    }

    fallback() external payable {
        console.log("----- fallback:", msg.value);
    }

    receive() external payable {
        console.log("----- receive:", msg.value);
    }
}
