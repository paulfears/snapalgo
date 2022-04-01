export declare const abiERC20: readonly [{
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_spender";
        readonly type: "address";
    }, {
        readonly name: "_value";
        readonly type: "uint256";
    }];
    readonly name: "approve";
    readonly outputs: readonly [{
        readonly name: "success";
        readonly type: "bool";
    }];
    readonly payable: false;
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
        readonly name: "_value";
        readonly type: "uint256";
    }];
    readonly name: "transferFrom";
    readonly outputs: readonly [{
        readonly name: "success";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "decimals";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "version";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly name: "balance";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "symbol";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_to";
        readonly type: "address";
    }, {
        readonly name: "_value";
        readonly type: "uint256";
    }];
    readonly name: "transfer";
    readonly outputs: readonly [{
        readonly name: "success";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "_spender";
        readonly type: "address";
    }, {
        readonly name: "_value";
        readonly type: "uint256";
    }, {
        readonly name: "_extraData";
        readonly type: "bytes";
    }];
    readonly name: "approveAndCall";
    readonly outputs: readonly [{
        readonly name: "success";
        readonly type: "bool";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [{
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly name: "_spender";
        readonly type: "address";
    }];
    readonly name: "allowance";
    readonly outputs: readonly [{
        readonly name: "remaining";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "_initialAmount";
        readonly type: "uint256";
    }, {
        readonly name: "_tokenName";
        readonly type: "string";
    }, {
        readonly name: "_decimalUnits";
        readonly type: "uint8";
    }, {
        readonly name: "_tokenSymbol";
        readonly type: "string";
    }];
    readonly type: "constructor";
}, {
    readonly payable: false;
    readonly type: "fallback";
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
        readonly indexed: false;
        readonly name: "_value";
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
        readonly name: "_spender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly name: "_value";
        readonly type: "uint256";
    }];
    readonly name: "Approval";
    readonly type: "event";
}];
