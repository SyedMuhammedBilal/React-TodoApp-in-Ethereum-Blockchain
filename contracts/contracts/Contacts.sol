// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Contacts {
    uint public count = 0;

    struct Contact {
        uint id;
        string name;
        string phone;
    }

    constructor() {
        createContact("syed bilal", "+1 222 333 444");
    }

    mapping (uint => Contact) public contacts;

    function createContact(string memory _name, string memory _phone) public {
        count++;
        contacts[count] = Contact(count, _name, _phone);
    }
}