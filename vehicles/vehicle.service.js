const config = require('config.json');
const db = require('_helpers/db');
const sendEmail = require('_helpers/send-email');

module.exports = {
    getAll,
    getAllActiveSupplierId,
    getById,
    getByUserId,
    getBySupplierId,
    create,
    update,
    delete: _delete
};
        
async function getAll() {
    const vehicles = await db.Vehicle.find();
    return vehicles.map(x => basicDetails(x));
}

async function getAllActiveSupplierId(id) {
    const vehicles = await db.Vehicle.find({ supplier: id, status: "Enabled"});
    return vehicles.map(x => basicDetails(x));
}

async function getBySupplierId(id) {
    const vehicles = await db.Vehicle.find({ supplier: id});
    return vehicles.map(x => basicDetails(x));
}

async function getById(id) {
    const vehicle = await getApplication(id);
    return basicDetails(vehicle);
}

async function getByUserId(user_id) {
    const vehicles = await db.Vehicle.find({ user_id: user_id });
    return vehicles; //basicDetails(vehicle);
}

async function create(params) {
    const vehicle = new db.Vehicle(params);

    // save vehicle
    await vehicle.save();
    return basicDetails(vehicle);
}

async function update(id, params) {
    const vehicle = await getApplication(id);

    if( params.status !== '' )
    {
        let message;
        let origin = "http://localhost:8100";
        if( params.status == 'Approved' ) 
        {
            message = `<h4>Cogratulation !! Your vehicle is Successful!</h4>
                        <p>Please visit the <a href="${origin}/create-tutor-profile/${vehicle.id}">Registration</a> page complete your Tutor profile.</p>`;
        }
        else if( params.status == 'Declined' ) 
            message = `<h4>Your vehicle has been Declined!</h4>
            <p>According to requirement, you do not qualify with us as Tutor</p><br/><br/><p>Thank you for submitting your vehicle.</p>`;

        /* await sendEmail({
            to: vehicle.email,
            subject: 'Tutor Vehicle Response',
            html: message
        }); */
    }
    // copy params to vehicle and save
    Object.assign(vehicle, params);
    vehicle.updated = Date.now();
    await vehicle.save();

    return basicDetails(vehicle);
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
    const vehicle = await getApplication(id);
    await vehicle.remove();
}

// helper functions

async function getApplication(id) {
    if (!db.isValidId(id)) throw 'Vehicle not found';
    const vehicle = await db.Vehicle.findById(id);
    if (!vehicle) throw 'Vehicle not found';
    return vehicle;
}

function basicDetails(vehicle) {
    const { id, name, supplier, contact_no, car_model, car_color, no_plate, documents, profile_picture, status, created } = vehicle;
    return { id, name, supplier, contact_no, car_model, car_color, no_plate, documents, profile_picture, status, created };
}
