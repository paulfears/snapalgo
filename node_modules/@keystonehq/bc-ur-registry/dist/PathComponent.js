"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathComponent = void 0;
class PathComponent {
    constructor(args) {
        this.getIndex = () => this.index;
        this.isWildcard = () => this.wildcard;
        this.isHardened = () => this.hardened;
        this.index = args.index;
        this.hardened = args.hardened;
        if (this.index !== undefined) {
            this.wildcard = false;
        }
        else {
            this.wildcard = true;
        }
        if (this.index && (this.index & PathComponent.HARDENED_BIT) !== 0) {
            throw new Error(`#[ur-registry][PathComponent][fn.constructor]: Invalid index ${this.index} - most significant bit cannot be set`);
        }
    }
}
exports.PathComponent = PathComponent;
PathComponent.HARDENED_BIT = 0x80000000;
//# sourceMappingURL=PathComponent.js.map