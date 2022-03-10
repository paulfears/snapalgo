const algosdk = require('algosdk/dist/cjs');


const hi_base32_1 = require("hi-base32");
const msgpack = require("algo-msgpack-with-bigint");
const nacl = require('tweetnacl');
const sha512 = require('js-sha512');

function containsEmpty(obj) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (!obj[key] || obj[key].length === 0) {
                return { containsEmpty: true, firstEmptyKey: key };
            }
        }
    }
    return { containsEmpty: false, firstEmptyKey: undefined };
}

function decodeAddress(address) {
    
    function genericHash(arr) {
        return sha512.sha512_256.array(arr);    
    }
    function arrayEqual(a, b) {
        if (a.length !== b.length) {
            return false;
        }
        return Array.from(a).every((val, i) => val === b[i]);
    }
    const ALGORAND_ADDRESS_BYTE_LENGTH = 36;
    const ALGORAND_CHECKSUM_BYTE_LENGTH = 4;
    const ALGORAND_ADDRESS_LENGTH = 58;
    const MALFORMED_ADDRESS_ERROR_MSG = 'address seems to be malformed';
    const CHECKSUM_ADDRESS_ERROR_MSG = 'wrong checksum for address';
    const PUBLIC_KEY_LENGTH = nacl.sign.publicKeyLength;
    const SECRET_KEY_LENGTH = nacl.sign.secretKeyLength;
    const HASH_BYTES_LENGTH = 32;
    const SEED_BTYES_LENGTH = 32;
    if (typeof address !== 'string' || address.length !== ALGORAND_ADDRESS_LENGTH)
        throw new Error(MALFORMED_ADDRESS_ERROR_MSG);
    // try to decode
    const decoded = hi_base32_1.decode.asBytes(address.toString());
    // Sanity check
    if (decoded.length !== ALGORAND_ADDRESS_BYTE_LENGTH)
        throw new Error(MALFORMED_ADDRESS_ERROR_MSG);
    // Find publickey and checksum
    const pk = new Uint8Array(decoded.slice(0, ALGORAND_ADDRESS_BYTE_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH));
    const cs = new Uint8Array(decoded.slice(PUBLIC_KEY_LENGTH, ALGORAND_ADDRESS_BYTE_LENGTH));
    // Compute checksum
    const checksum = genericHash(pk)
        .slice(HASH_BYTES_LENGTH - ALGORAND_CHECKSUM_BYTE_LENGTH, HASH_BYTES_LENGTH);
    // Check if the checksum and the address are equal
    if (!arrayEqual(checksum, cs))
        throw new Error(CHECKSUM_ADDRESS_ERROR_MSG);
    return { publicKey: pk, checksum: cs };
}
function encode(obj) {
    // Check for empty values
    const emptyCheck = containsEmpty(obj);
    if (emptyCheck.containsEmpty) {
        throw new Error("contains empty string" + emptyCheck.firstEmptyKey);
    }
    // enable the canonical option
    const options = { sortKeys: true };
    return msgpack.encode(obj, options);
}

export async function pay(from, to, amount, note, private_key, params){
    function concatArrays(...arrs) {
        const size = arrs.reduce((sum, arr) => sum + arr.length, 0);
        const c = new Uint8Array(size);
        let offset = 0;
        for (let i = 0; i < arrs.length; i++) {
            c.set(arrs[i], offset);
            offset += arrs[i].length;
        }
        return c;
    }
    console.log(params)
    let fee = params.fee;
    let fv = params.firstRound;
    let lv = params.lastRound;
    let gen = params.genesisID;
    let gh = params.genesisHash;
    let snd = decodeAddress(from).publicKey;
    let rcv = decodeAddress(to).publicKey;
    let amt = amount;
    let tag = Buffer.from('TX');
    let tx_obj = {
        amt: Number(amt),
        fee: Number(fee),
        fv: Number(fv),
        lv: Number(lv),
        snd: Buffer.from(snd, 'base64'),
        type: 'pay',
        gen: gen,
        gh: Buffer.from(gh, 'base64'),
        rcv: Buffer.from(rcv, 'base64'),
    };
    if(note){
        console.log("note is true");
        tx_obj.note = Buffer.from(note, 'base64');
    }
    let to_be_signed = concatArrays(tag, encode(tx_obj));
    let sig = Buffer.from(nacl.sign(to_be_signed, private_key), 'base64').slice(0, 64);
    let stx = {
        sig: sig,
        txn: tx_obj
    }
    return new Uint8Array(encode(stx));
}