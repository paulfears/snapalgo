"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lockdown_1 = require("../common/lockdown/lockdown");
const IFrameSnapExecutor_1 = require("../iframe/IFrameSnapExecutor");
// The testing iframe is run without lockdown-more due to JSDOM incompatibilities
(0, lockdown_1.executeLockdown)();
IFrameSnapExecutor_1.IFrameSnapExecutor.initialize();
//# sourceMappingURL=index.js.map