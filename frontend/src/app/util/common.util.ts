import { config } from "../configuration/common.conf";
const CryptoJS = require("crypto-js");

export const setSessionStorage = (key: string, value: string) =>
{
    const hashedKey = genHash(key);
    const entryptedValue = encryptString(value);
    sessionStorage.setItem(hashedKey, entryptedValue);
}
export const getSessionStorage = (key: string) =>
{
    const hashedKey = genHash(key);
    const encryptedValue = sessionStorage.getItem(hashedKey);
    return decryptString(encryptedValue ? encryptedValue : "");
}
export const removeSessionStorage = (key: string) =>
{
    const hashedKey = genHash(key);
    sessionStorage.removeItem(hashedKey);
}
const encryptString = (str: string) =>
{
    const str2 = CryptoJS.AES.encrypt(str, config.STORAGE_ENCRYPTION_KEY).toString();
    return str2;
}
export const decryptString = (str: string) =>
{
    const str2 = CryptoJS.AES.decrypt(str, config.STORAGE_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    return str2;
}
const genHash = (str: string) =>
{
    return CryptoJS.MD5(str);
}