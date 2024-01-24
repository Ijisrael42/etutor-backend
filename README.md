# E-tutor Backend

Models
- Accounts: User Account Model
- Bid(discontinued): Bid Model to bid for Tutors
- Fields: Tutor's field of study
- Questions: Question Model for Students to ask Tutor questions.
- Tutors: Tutor Model
- Files - File upload model

Middleware and Helpers
-  Authentication
-  Push Notifications
-  Sending Emails

## Packages

- NodeJs
- ExpressJs v4
- Mongoose and MongoDB
- Mutler Gridfs Storage
- Dotenv
- Nodemon
- Firebase-Admin
- Node-Mailer
- JWT
- 

## Quick Start

1. Get the latest version

```shell
git clone https://github.com/Ijisrael42/etutor-backend.git E-tutor-backend_server
cd E-tutor-backend_server
```

2. Run

```shell
npm install
```

3. Create an .e google service_account file

Add Variables:

1. MONGODB_CONNECTIONSTRING: e.g mongodb+srv://<username>:<password>@<mongo_cluster>/eTutors?retryWrites=true&w=majority
- This variable points to Mongo database

2. SECRET: e.g F6505213-19EC-4A7D-8C6C-29982505AE4FC2058156-23EF-46C8-94D5-671836AF4909E78EAFBF-9212-4D94-91BD-7449BEA10171A180A8D6
Go to https://www.guidgenerator.com/ to generate secret string
```

4. Run

```shell
npm start or node ./server.js
```

5. Run in development mode

```shell
npm run dev or nodemon ./server.js
```
