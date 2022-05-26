'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var baseEthKeyring = require('@keystonehq/base-eth-keyring');
var events = require('events');
var obsStore = require('@metamask/obs-store');
var bcUrRegistryEth = require('@keystonehq/bc-ur-registry-eth');
var uuid = require('uuid');
var tx = require('@ethereumjs/tx');
var rlp = _interopDefault(require('rlp'));

class MetamaskInteractionProvider extends events.EventEmitter {
  constructor() {
    super();

    this.cleanSyncListeners = () => {
      this.removeAllListeners("keystone-sync_success-hdkey");
      this.removeAllListeners("keystone-sync_success-account");
      this.removeAllListeners("keystone-sync_cancel");
    };

    this.cleanSignListeners = requestId => {
      this.removeAllListeners(`${requestId}-signed`);
      this.removeAllListeners(`${requestId}-canceled`);
    };

    this.readCryptoHDKeyOrCryptoAccount = () => {
      return new Promise((resolve, reject) => {
        this.memStore.updateState({
          sync: {
            reading: true
          }
        });
        this.on("keystone-sync_success-hdkey", cbor => {
          const cryptoHDKey = bcUrRegistryEth.CryptoHDKey.fromCBOR(Buffer.from(cbor, "hex"));
          this.resetState();
          resolve(cryptoHDKey);
        });
        this.on("keystone-sync_success-account", cbor => {
          const cryptoAccount = bcUrRegistryEth.CryptoAccount.fromCBOR(Buffer.from(cbor, "hex"));
          this.resetState();
          resolve(cryptoAccount);
        });
        this.on("keystone-sync_cancel", () => {
          this.resetState();
          reject(new Error("KeystoneError#sync_cancel. Sync process canceled, please retry"));
        });
      });
    };

    this.submitCryptoHDKey = cbor => {
      this.emit("keystone-sync_success-hdkey", cbor);
    };

    this.submitCryptoAccount = cbor => {
      this.emit("keystone-sync_success-account", cbor);
    };

    this.cancelSync = () => {
      this.emit("keystone-sync_cancel");
    };

    this.requestSignature = (signRequest, requestTitle, requestDescription) => {
      return new Promise((resolve, reject) => {
        const ur = signRequest.toUR();
        const requestIdBuffer = signRequest.getRequestId();
        const requestId = uuid.stringify(requestIdBuffer);
        const signPayload = {
          requestId,
          payload: {
            type: ur.type,
            cbor: ur.cbor.toString("hex")
          },
          title: requestTitle,
          description: requestDescription
        };
        this.memStore.updateState({
          sign: {
            request: signPayload
          }
        });
        this.once(`${requestId}-signed`, cbor => {
          const ethSignature = bcUrRegistryEth.ETHSignature.fromCBOR(Buffer.from(cbor, "hex"));
          this.resetState();
          resolve(ethSignature);
        });
        this.once(`${requestId}-canceled`, () => {
          this.resetState();
          reject(new Error("KeystoneError#Tx_canceled. Signing canceled, please retry"));
        });
      });
    };

    this.submitSignature = (requestId, cbor) => {
      this.emit(`${requestId}-signed`, cbor);
    };

    this.cancelRequestSignature = () => {
      const signPayload = this.memStore.getState().sign.request;

      if (signPayload) {
        const {
          requestId
        } = signPayload;
        this.memStore.updateState({
          sign: {}
        });
        this.emit(`${requestId}-canceled`);
      }
    };

    this.reset = () => {
      this.cleanSyncListeners();
      const signPayload = this.memStore.getState().sign.request;

      if (signPayload) {
        const {
          requestId
        } = signPayload;
        this.cleanSignListeners(requestId);
      }

      this.resetState();
    };

    this.resetState = () => {
      this.memStore.updateState({
        sync: {
          reading: false
        },
        sign: {}
      });
    };

    if (MetamaskInteractionProvider.instance) {
      return MetamaskInteractionProvider.instance;
    }

    this.memStore = new obsStore.ObservableStore({
      sync: {
        reading: false
      },
      sign: {},
      _version: 1
    });
    MetamaskInteractionProvider.instance = this;
  }

}

class MetaMaskKeyring extends baseEthKeyring.BaseKeyring {
  constructor(opts) {
    super(opts);

    this.getInteraction = () => {
      return new MetamaskInteractionProvider();
    };

    this.resetStore = () => {
      this.getInteraction().reset();
    };

    this.getMemStore = () => {
      return this.getInteraction().memStore;
    };

    this.removeAccount = address => {
      if (!this.accounts.map(a => a.toLowerCase()).includes(address.toLowerCase())) {
        throw new Error(`Address ${address} not found in this keyring`);
      }

      this.accounts = this.accounts.filter(a => a.toLowerCase() !== address.toLowerCase());
    };

    this.forgetDevice = () => {
      //common props
      this.page = 0;
      this.perPage = 5;
      this.accounts = [];
      this.currentAccount = 0;
      this.name = "QR Hardware";
      this.initialized = false; //hd props;

      this.xfp = "";
      this.xpub = "";
      this.hdPath = "";
      this.indexes = {};
      this.hdk = undefined; //pubkey props;

      this.paths = {};
    };

    this.submitCryptoHDKey = this.getInteraction().submitCryptoHDKey;
    this.submitCryptoAccount = this.getInteraction().submitCryptoAccount;
    this.submitSignature = this.getInteraction().submitSignature;
    this.cancelSync = this.getInteraction().cancelSync;
    this.cancelSignRequest = this.getInteraction().cancelRequestSignature;

    if (MetaMaskKeyring.instance) {
      MetaMaskKeyring.instance.deserialize(opts);
      return MetaMaskKeyring.instance;
    }

    MetaMaskKeyring.instance = this;
  }

  async signTransaction(address, tx$1) {
    const dataType = tx$1.type === 0 ? bcUrRegistryEth.DataType.transaction : bcUrRegistryEth.DataType.typedTransaction;
    let messageToSign;

    if (tx$1.type === 0) {
      messageToSign = rlp.encode(tx$1.getMessageToSign(false));
    } else {
      messageToSign = tx$1.getMessageToSign(false);
    }

    const hdPath = await this._pathFromAddress(address);
    const chainId = tx$1.common.chainId();
    const requestId = uuid.v4();
    const ethSignRequest = bcUrRegistryEth.EthSignRequest.constructETHRequest(messageToSign, dataType, hdPath, this.xfp, requestId, chainId, address);
    const {
      r,
      s,
      v
    } = await this.requestSignature(requestId, ethSignRequest, "Scan with your Keystone", 'After your Keystone has signed the transaction, click on "Scan Keystone" to receive the signature');
    const txJson = tx$1.toJSON();
    txJson.v = v;
    txJson.s = s;
    txJson.r = r;
    txJson.type = tx$1.type;
    const transaction = tx.TransactionFactory.fromTxData(txJson, {
      common: tx$1.common
    });
    return transaction;
  }

}
MetaMaskKeyring.type = baseEthKeyring.BaseKeyring.type;

exports.MetaMaskKeyring = MetaMaskKeyring;
//# sourceMappingURL=metamask-airgapped-keyring.cjs.development.js.map
