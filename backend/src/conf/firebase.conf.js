const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const { config } = require('./common.conf');
  
// Initialize Firebase
initializeApp(config.FIREBASE_CONFIG);

const storage = getStorage();

uploadFile = async (req, filePath) =>
{
    const epoch = Date.now();
    const fileName = req.file.originalname + epoch;
    const storageRef = ref(storage, `${filePath}/${fileName}`);
    const metadata = {
        contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
}

module.exports = { uploadFile };