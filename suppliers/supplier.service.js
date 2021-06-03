const config = require('config.json');
const db = require('_helpers/db');
const sendEmail = require('_helpers/send-email');

module.exports = {
    getAll,
    getAllActive,
    getById,
    getByUserId,
    getBySupplierId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const suppliers = await db.Supplier.find();
    return suppliers.map(x => basicDetails(x));
}

async function getAllActive() {
    const suppliers = await db.Supplier.find({ status: "Enabled"});
    return suppliers.map(x => basicDetails(x));
}

async function getBySupplierId(id) {
    const suppliers = await db.Supplier.find({ supplier: id});
    return suppliers.map(x => basicDetails(x));
}

async function getById(id) {
    const supplier = await getApplication(id);
    return basicDetails(supplier);
}

async function getByUserId(user_id) {
    const suppliers = await db.Supplier.find({ user_id: user_id });
    return suppliers; //basicDetails(supplier);
}

async function create(params) {
    const supplier = new db.Supplier(params);

    // save supplier
    await supplier.save();
    return basicDetails(supplier);
}

async function update(id, params) {
    const supplier = await getApplication(id);

    if( params.status !== '' )
    {
        let message;
        let origin = "http://localhost:8100";
        if( params.status == 'Approved' ) 
        {
            message = `<h4>Cogratulation !! Your supplier is Successful!</h4>
                        <p>Please visit the <a href="${origin}/create-tutor-profile/${supplier.id}">Registration</a> page complete your Tutor profile.</p>`;
        }
        else if( params.status == 'Declined' ) 
            message = `<h4>Your supplier has been Declined!</h4>
            <p>According to requirement, you do not qualify with us as Tutor</p><br/><br/><p>Thank you for submitting your supplier.</p>`;

        /* await sendEmail({
            to: supplier.email,
            subject: 'Tutor Supplier Response',
            html: message
        }); */
    }
    // copy params to supplier and save
    Object.assign(supplier, params);
    supplier.updated = Date.now();
    await supplier.save();

    return basicDetails(supplier);
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
    const supplier = await getApplication(id);
    await supplier.remove();
}

// helper functions

async function getApplication(id) {
    if (!db.isValidId(id)) throw 'Supplier not found';
    const supplier = await db.Supplier.findById(id);
    if (!supplier) throw 'Supplier not found';
    return supplier;
}

function basicDetails(supplier) {
    const { id, name, email, contact_no, idpassport_no, address, category, status, experience, created } = supplier;
    return { id, name, email, contact_no, idpassport_no, address, category, status, experience, created };
}
