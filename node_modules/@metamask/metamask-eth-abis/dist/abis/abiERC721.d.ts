export declare const abiERC721: readonly [{
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "interfaceID";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly name: "_name";
        readonly type: "string";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "getApproved";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_approved";
        readonly type: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "approve";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "totalSupply";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_from";
        readonly type: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "transferFrom";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly name: "_index";
        readonly type: "uint256";
    }];
    readonly name: "tokenOfOwnerByIndex";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_from";
        readonly type: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_index";
        readonly type: "uint256";
    }];
    readonly name: "tokenByIndex";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "ownerOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "symbol";
    readonly outputs: readonly [{
        readonly name: "_symbol";
        readonly type: "string";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_operator";
        readonly type: "address";
    }, {
        readonly name: "_approved";
        readonly type: "bool";
    }];
    readonly name: "setApprovalForAll";
    readonly outputs: readonly [];
    readonly payable: false;
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_from";
        readonly type: "address";
    }, {
        readonly name: "_to";
        readonly type: "address";
    }, {
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly payable: true;
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "tokenURI";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly name: "_operator";
        readonly type: "address";
    }];
    readonly name: "isApprovedForAll";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "_from";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "_to";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "Transfer";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "_approved";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "Approval";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly name: "_operator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly name: "_approved";
        readonly type: "bool";
    }];
    readonly name: "ApprovalForAll";
    readonly type: "event";
}];
