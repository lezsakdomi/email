# lezsakdomi/email
An email sending application for shared domains

Works well with CloudFlare Email routes and based on sendgrid

## Use cases
- Useful
  - Users can send email, not only just receive
- Drop-in solution
  - Access is granted by setting up email forwarding
  - Anyone able to read emails at an address is able to send emails from that
- Easy to use
  - No fancy passwords and authentication - users are identified only by links
  - Administrator friendly - for setup, only a SENDGRID_API_KEY is needed to be provided and the application can be deployed to Firebase
- Cheap
  - Runs on Firebase and Sendgrid, which have generous trials

## Setup
1. Set up mail forwarding for your users
2. Set up sendgrid 
3. Set up config parameters
   1. Email domain
   2. SENDGRID_API_KEY
4. Deploy to Firebase
5. Set up a custom domain in Firebase

(details for steps come soon)
