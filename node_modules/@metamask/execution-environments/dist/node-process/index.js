"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lockdown_1 = require("../common/lockdown/lockdown");
const lockdown_more_1 = require("../common/lockdown/lockdown-more");
const ChildProcessSnapExecutor_1 = require("./ChildProcessSnapExecutor");
(0, lockdown_1.executeLockdown)();
(0, lockdown_more_1.executeLockdownMore)();
ChildProcessSnapExecutor_1.ChildProcessSnapExecutor.initialize();
//# sourceMappingURL=index.js.map