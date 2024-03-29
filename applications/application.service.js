﻿const config = require('config.json');
const db = require('_helpers/db');
const sendEmail = require('_helpers/send-email');
const accountService = require('../accounts/account.service');

module.exports = {
    getAll,
    getById,
    getByUserId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const applications = await db.Application.find();
    return applications.map(x => basicDetails(x));
}

async function getById(id) {
    const application = await getApplication(id);
    return basicDetails(application);
}

async function getByUserId(user_id) {
    const applications = await db.Application.find({ user_id: user_id });
    return applications; //basicDetails(application);
}

async function create(params) {
    const application = new db.Application(params);

    // save application
    await application.save();

    if( params.email ) {
        message = `<h4>Congratulation !! Your application has been received!</h4>
                <p>The approval of your application will be sent through your .</p><br/><br/> 
                <p>Kind regards.</p>`;
        //await sendEmail({ to: params.email, subject: 'Application Submission', html: message });
    }
    return basicDetails(application);
}

async function update(id, params, ipAddress) {
    const application = await getApplication(id);
    let account = {};
    if( params.status !== '' )
    {
        let message;
        let origin = "http://localhost:8100";
        if( params.status == 'Approved' ) 
        {
            account = {};//await db.Account.findOne({ email: application.email });
            if( account.email ) {
                await accountService.update( account.id, { supplier: application.id }, ipAddress);
                message = `<h4>Congratulation !! Your application is Successful!</h4>
                        <p>Please visit your Account to access your account new features .</p>`;
            }
            else 
                message = `<h4>Congratulation !! Your application is Successful!</h4>
                        <p>Please visit the <a href="${origin}/create-profile/${application.id}">Registration</a> page complete your Registration Profile.</p>`;
        }
        else if( params.status == 'Declined' ) 
            message = `<h4>Your application has been Declined!</h4>
            <p>According to requirement, you do not qualify with us as Tutor</p><br/><br/><p>Thank you for submitting your application.</p>`;

        await sendEmail({
            to: application.email,
            subject: 'Application Response',
            html: message
        });
    }
    // copy params to application and save
    Object.assign(application, params);
    application.updated = Date.now();
    await application.save();

    return account;//basicDetails(account);
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'Sign-up Verification API - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}


async function _delete(id) {
    const application = await getApplication(id);
    await application.remove();
}

// helper functions

async function getApplication(id) {
    if (!db.isValidId(id)) throw 'Application not found';
    const application = await db.Application.findById(id);
    if (!application) throw 'Application not found';
    return application;
}

function basicDetails(application) {
    const { id, name, email, description, category, status, experience, documents, created } = application;
    return { id, name, email, description, category, status, experience, documents, created };
}
