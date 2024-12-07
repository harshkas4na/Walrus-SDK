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
const crypto_js_1 = __importDefault(require("crypto-js"));
exports.default = {
    uploadFile: (publisherUrl_1, file_1, ...args_1) => __awaiter(void 0, [publisherUrl_1, file_1, ...args_1], void 0, function* (publisherUrl, file, epochs = 5) {
        const url = `${publisherUrl}/v1/store?epochs=${epochs}`;
        const response = yield fetch(url, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": "application/octet-stream",
            },
        });
        return response;
    }),
    uploadWithEncryption: (publisherUrl_1, file_1, ...args_1) => __awaiter(void 0, [publisherUrl_1, file_1, ...args_1], void 0, function* (publisherUrl, file, epochs = 5, password) {
        // Derive a key using SHA-256
        const key = crypto_js_1.default.SHA256(password).toString(crypto_js_1.default.enc.Hex);
        const fileContent = yield readFileAsArrayBuffer(file);
        const wordArray = crypto_js_1.default.lib.WordArray.create(new Uint8Array(fileContent));
        const encrypted = crypto_js_1.default.AES.encrypt(wordArray, key).toString();
        // Upload encrypted file
        const encryptedBytes = new Uint8Array(atob(encrypted)
            .split("")
            .map((char) => char.charCodeAt(0)));
        const blob = new Blob([encryptedBytes], {
            type: "application/octet-stream",
        });
        const response = yield fetch(`${publisherUrl}/v1/store?epochs=5`, {
            method: "PUT",
            body: blob,
            headers: {
                "Content-Type": "application/octet-stream",
            },
        });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }
        const result = yield response.json();
        return result;
    }),
};
const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
    });
};
