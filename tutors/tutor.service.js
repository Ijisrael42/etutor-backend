const config = require('config.json');
const db = require('_helpers/db');
const sendEmail = require('_helpers/send-email');

module.exports = {
    getAll,
    getAllActive,
    getById,
    getByParams,
    getByUserId,
    getByTutorId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const tutors = await db.Tutor.find();
    return tutors.map(x => basicDetails(x));
}

async function getByParams(params) {
    const tutors = await db.Tutor.find(params);
    return tutors.map(x => basicDetails(x));
}

async function getAllActive() {
    const tutors = await db.Tutor.find({ account_status: "Active", status: "Online"});
    // const tutors = await db.Tutor.find({ status: "Enabled"});

    return tutors.map(x => basicDetails(x));
}

async function getByTutorId(id) {
    const tutors = await db.Tutor.find({ tutor: id});
    return tutors.map(x => basicDetails(x));
}

async function getById(id) {
    const tutor = await getApplication(id);
    return basicDetails(tutor);
}

async function getByUserId(user_id) {
    const tutors = await db.Tutor.find({ user_id: user_id });
    return tutors; //basicDetails(tutor);
}

async function create(params) {
    const tutor = new db.Tutor(params);

    // save tutor
    await tutor.save();
    return basicDetails(tutor);
}

async function update(id, params) {
    const tutor = await getApplication(id);

    if( params.application_status !== '' )
    {
        let message;
        let origin = "http://localhost:8100";
        if( params.application_status === 'Approved' ) 
        {
            account = {};//await db.Account.findOne({ email: tutor.email });
            params.account_status = 'Active';
            params.status = 'Offline';
            if( account.email ) {
                await accountService.update( account.id, { tutor: tutor.id }, ipAddress);
                message = `<h4>Congratulation !! Your application is Successful!</h4>
                        <p>Please visit your Account to access your account new features .</p>`;
            }
            else 
                message = `<h4>Congratulation !! Your application is Successful!</h4>
                        <p>Please visit the <a href="${origin}/create-profile/${tutor.id}">Registration</a> page complete your Registration Profile.</p>`;
        }
        else if( params.application_status === 'Declined' ) 
            message = `<h4>Your application has been Declined!</h4>
            <p>According to requirement, you do not qualify with us as Tutor</p><br/><br/><p>Thank you for submitting your application.</p>`;

/*         await sendEmail({
            to: tutor.email,
            subject: 'Application Response',
            html: message
        });
 */    
    }

    /* else if( params.status !== '' )
    {
        let message;
        let origin = "http://localhost:8100";
        if( params.status == 'Approved' ) 
        {
            message = `<h4>Cogratulation !! Your tutor is Successful!</h4>
                        <p>Please visit the <a href="${origin}/create-tutor-profile/${tutor.id}">Registration</a> page complete your Tutor profile.</p>`;
        }
        else if( params.status == 'Declined' ) 
            message = `<h4>Your tutor has been Declined!</h4>
            <p>According to requirement, you do not qualify with us as Tutor</p><br/><br/><p>Thank you for submitting your tutor.</p>`;

        / * await sendEmail({
            to: tutor.email,
            subject: 'Tutor Tutor Response',
            html: message
        }); * /
    } */
    // copy params to tutor and save
    Object.assign(tutor, params);
    tutor.updated = Date.now();
    await tutor.save();

    return basicDetails(tutor);
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
    const tutor = await getApplication(id);
    await tutor.remove();
}

// helper functions

async function getApplication(id) {
    if (!db.isValidId(id)) throw 'Tutor not found';
    const tutor = await db.Tutor.findById(id);
    if (!tutor) throw 'Tutor not found';
    return tutor;
}

function basicDetails(tutor) {
    const { id, name, email, description, category, application_status, documents, account_status, status, experience, created } = tutor;
    return { id, name, email, description, category, application_status, documents, account_status, status, experience, created };
}
