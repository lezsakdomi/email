import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import 'dotenv/config'

admin.initializeApp()

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const send = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', "Not signed in")
    }

    const user = await admin.auth().getUser(context.auth?.uid)
    const userHasEmail = user.providerData.some(provider => provider.email == data.from);
    if (!userHasEmail) {
        throw new functions.https.HttpsError('permission-denied', `Not logged in with account '${data.from}'`, {
            requiredEmail: data.from,
        })
    }

    try {
        const result = await sgMail.send(data)
        return {result}
    } catch (e) {
        console.error(e)
        throw new functions.https.HttpsError('internal', "Failed to send email", {
            sgError: String(e),
        })
    }
})
