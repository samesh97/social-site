import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { config } from './common.conf';
  
// Initialize Firebase
initializeApp(config.FIREBASE_CONFIG);

const storage = getStorage();

const uploadFile = async (req, filePath) =>
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

const uploadMultipleFile = async (req, filePath) =>
{
    const list = [];
    for (let file of req.files)
    {
        const epoch = Date.now();
        const fileName = file.originalname + epoch;
        const storageRef = ref(storage, `${filePath}/${fileName}`);
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        list.push(downloadURL);
    }
    return list;
   
}

export { uploadFile, uploadMultipleFile };