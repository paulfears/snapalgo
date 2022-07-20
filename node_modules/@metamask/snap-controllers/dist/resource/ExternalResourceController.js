"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalResourceController = void 0;
const obs_store_1 = require("@metamask/obs-store");
const safe_event_emitter_1 = __importDefault(require("@metamask/safe-event-emitter"));
const eth_rpc_errors_1 = require("eth-rpc-errors");
const nanoid_1 = require("nanoid");
const alwaysRequiredFields = ['fromDomain'];
const computeState = (storageKey, initialResources) => {
    return { [storageKey]: initialResources };
};
const getUnauthorizedMessage = (id) => `Not authorized to access resource with id "${id}".`;
/**
 * A class intended to describe a particular resource that is managed by snaps.
 * Example resources are assets.
 *
 * These are things that MetaMask treats as first-class objects with distinct properties within its own UI.
 */
class ExternalResourceController extends safe_event_emitter_1.default {
    constructor({ storageKey, requiredFields, initialResources, }) {
        super();
        this.requiredFields = requiredFields;
        this.storageKey = storageKey;
        this.store = new obs_store_1.ObservableStore(computeState(storageKey, initialResources));
    }
    getResources() {
        return Object.assign({}, this.store.getState()[this.storageKey]);
    }
    setResources(resources) {
        this.store.updateState({
            [this.storageKey]: resources,
        });
    }
    clearResources() {
        this.setResources({});
    }
    deleteResourcesFor(fromDomain) {
        const resources = this.getResources();
        const newResources = Object.entries(resources).reduce((acc, [id, resource]) => {
            if (resource.fromDomain !== fromDomain) {
                acc[id] = resource;
            }
            return acc;
        }, {});
        this.setResources(newResources);
    }
    get(fromDomain, id) {
        const resource = this.getResources()[id];
        if (resource && resource.fromDomain !== fromDomain) {
            throw eth_rpc_errors_1.ethErrors.provider.unauthorized({
                message: getUnauthorizedMessage(id),
            });
        }
        return resource ? Object.assign({}, resource) : null;
    }
    getAllResources(fromDomain) {
        return Object.values(this.getResources()).filter((resource) => {
            return resource.fromDomain === fromDomain;
        });
    }
    add(fromDomain, resource) {
        const newResource = this.processNewResource(fromDomain, resource);
        const { id } = newResource;
        const resources = this.getResources();
        if (resources[id]) {
            throw new Error(`Resource with id "${id}" already exists.`);
        }
        else {
            resources[id] = newResource;
            this.setResources(resources);
        }
        return newResource.id;
    }
    update(fromDomain, resource) {
        const { id } = resource;
        const resources = this.getResources();
        const existingResource = resources[id];
        if (!existingResource) {
            throw eth_rpc_errors_1.ethErrors.rpc.resourceNotFound({
                message: `Resource with id "${id}" not found.`,
            });
        }
        else if (existingResource.fromDomain !== fromDomain) {
            throw eth_rpc_errors_1.ethErrors.provider.unauthorized({
                message: getUnauthorizedMessage(id),
            });
        }
        resources[id] = this.processNewResource(fromDomain, Object.assign(Object.assign({}, resources[id]), resource));
        this.setResources(resources);
        return id;
    }
    processNewResource(fromDomain, resource) {
        this.requiredFields.forEach((requiredField) => {
            if (!(requiredField in resource)) {
                throw eth_rpc_errors_1.ethErrors.rpc.invalidParams(`Resource from "${fromDomain}" missing required field: ${requiredField}`);
            }
        });
        return Object.assign(Object.assign({}, resource), { fromDomain, id: resource.id || (0, nanoid_1.nanoid)() });
    }
    delete(fromDomain, id) {
        const resources = this.getResources();
        const existingResource = resources[id];
        if (!existingResource) {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidParams({
                message: `Resource with id "${id}" not found.`,
            });
        }
        else if (existingResource.fromDomain !== fromDomain) {
            throw eth_rpc_errors_1.ethErrors.provider.unauthorized({
                message: getUnauthorizedMessage(id),
            });
        }
        delete resources[id];
        this.setResources(resources);
        return null;
    }
    handleRpcRequest(fromDomain, method, arg) {
        if (!fromDomain || typeof fromDomain !== 'string') {
            throw new Error('Invalid fromDomain.');
        }
        switch (method) {
            case 'get':
                return this.get(fromDomain, arg);
            case 'getAll':
                return this.getAllResources(fromDomain);
            case 'add':
                return this.add(fromDomain, arg);
            case 'update':
                return this.update(fromDomain, arg);
            case 'delete':
                return this.delete(fromDomain, arg);
            default:
                throw eth_rpc_errors_1.ethErrors.rpc.methodNotFound({
                    message: `Not an asset method: ${method}`,
                });
        }
    }
}
exports.ExternalResourceController = ExternalResourceController;
//# sourceMappingURL=ExternalResourceController.js.map