pragma solidity >=0.4.22 <0.9.0;

contract Marketplace{
    uint public count = 0;
    mapping(uint => Transaction) public transactions;

    struct Transaction{
        uint id;
        uint amount;
        address sender;
        address payable reciever;
    }

    function createTransaction(address payable addressReciever) public payable{
        count ++;
        transactions[count] = Transaction(count, msg.value, msg.sender, addressReciever);
        addressReciever.transfer(msg.value);
    }

    function getCount() public view returns (uint){
        return count;
    }
}