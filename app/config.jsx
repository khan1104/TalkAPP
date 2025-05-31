import { initializeApp} from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
   //enter you firebase crdentials here eg
    //apikey
    // authDomain
    // projectId
    // storageBucket
    // messagingSenderId
    // appId
    // measurementId:
};

const IP = "192.168.68.3";   //replace with your actual ip or backend host url
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export {app,db,storage,IP};