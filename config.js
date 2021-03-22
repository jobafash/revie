import admin from 'firebase-admin'
import dotenv from 'dotenv'
import serviceAccount from './firebase-config.js'

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
  });


export default admin