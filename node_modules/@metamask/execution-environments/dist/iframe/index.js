"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lockdown_1 = require("../common/lockdown/lockdown");
const lockdown_more_1 = require("../common/lockdown/lockdown-more");
const IFrameSnapExecutor_1 = require("./IFrameSnapExecutor");
(0, lockdown_1.executeLockdown)();
(0, lockdown_more_1.executeLockdownMore)();
IFrameSnapExecutor_1.IFrameSnapExecutor.initialize();
//# sourceMappingURL=index.js.map