"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataItem = void 0;
class DataItem {
    constructor(data, tag) {
        this.setTag = (tag) => {
            this.tag = tag;
        };
        this.clearTag = () => {
            this.tag = undefined;
        };
        this.getTag = () => {
            return this.tag;
        };
        this.getData = () => {
            return this.data;
        };
        this.data = data;
        this.tag = tag;
    }
}
exports.DataItem = DataItem;
//# sourceMappingURL=DataItem.js.map