"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lockdown_1 = require("../common/lockdown/lockdown");
const lockdown_more_1 = require("../common/lockdown/lockdown-more");
const ThreadSnapExecutor_1 = require("./ThreadSnapExecutor");
(0, lockdown_1.executeLockdown)();
(0, lockdown_more_1.executeLockdownMore)();
ThreadSnapExecutor_1.ThreadSnapExecutor.initialize();
//# sourceMappingURL=index.js.map