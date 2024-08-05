import admin from "firebase-admin";

// Initialize Firebase Admin SDK
const serviceAccount = require("../../config/serviceAccount.config.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export async function verifyGoogleToken(idToken: string): Promise<any> {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw error;
  }
}
