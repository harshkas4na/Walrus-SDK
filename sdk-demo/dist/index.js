"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getFile_1 = __importDefault(require("./getFile/getFile"));
const uploadFile_1 = __importDefault(require("./uploadFile/uploadFile"));
class StorageSDK {
    constructor(config = {}) {
        var _a, _b;
        this.publisherUrl =
            (_a = config.publisherUrl) !== null && _a !== void 0 ? _a : "https://publisher.walrus-testnet.walrus.space";
        this.aggregatorUrl =
            (_b = config.aggregatorUrl) !== null && _b !== void 0 ? _b : "https://aggregator.walrus-testnet.walrus.space";
    }
    storeFile(file_1) {
        return __awaiter(this, arguments, void 0, function* (file, epochs = 5) {
            try {
                const response = yield uploadFile_1.default.uploadFile(this.publisherUrl, file, epochs);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return yield response.json();
            }
            catch (error) {
                throw new Error(`Upload error: ${error.message}`);
            }
        });
    }
    storeFileWithEncryption(file_1) {
        return __awaiter(this, arguments, void 0, function* (file, epochs = 5, password) {
            try {
                const response = yield uploadFile_1.default.uploadWithEncryption(this.publisherUrl, file, epochs, password);
                return response;
            }
            catch (error) {
                throw new Error(`Upload error: ${error.message}`);
            }
        });
    }
    readFile(blobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield getFile_1.default.getFile(this.aggregatorUrl, blobId);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.body;
            }
            catch (error) {
                throw new Error(`Read error: ${error.message}`);
            }
        });
    }
    readFileWithDecryption(blobId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blob = yield getFile_1.default.getFileWithDecryption(this.aggregatorUrl, blobId, password);
                return blob;
            }
            catch (error) {
                throw new Error(`Read error: ${error.message}`);
            }
        });
    }
}
module.exports = StorageSDK;
