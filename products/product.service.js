const config = require('config.json');
const db = require('_helpers/db');
const sendEmail = require('_helpers/send-email');

module.exports = {
    getAll,
    getById,
    getByUserId,
    getBySupplierId,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const products = await db.Product.find();
    return products.map(x => basicDetails(x));
}

async function getBySupplierId(id) {
    const products = await db.Product.find({ supplier: id});
    return products.map(x => basicDetails(x));
}

async function getById(id) {
    const product = await getApplication(id);
    return basicDetails(product);
}

async function getByUserId(user_id) {
    const products = await db.Product.find({ user_id: user_id });
    return products; //basicDetails(product);
}

async function create(params) {
    const product = new db.Product(params);

    // save product
    await product.save();
    return basicDetails(product);
}

async function update(id, params) {
    const product = await getApplication(id);

    if( params.status !== '' )
    {
        let message;
        let origin = "http://localhost:8100";
        if( params.status == 'Approved' ) 
        {
            message = `<h4>Cogratulation !! Your product is Successful!</h4>
                        <p>Please visit the <a href="${origin}/create-tutor-profile/${product.id}">Registration</a> page complete your Tutor profile.</p>`;
        }
        else if( params.status == 'Declined' ) 
            message = `<h4>Your product has been Declined!</h4>
            <p>According to requirement, you do not qualify with us as Tutor</p><br/><br/><p>Thank you for submitting your product.</p>`;

        /* await sendEmail({
            to: product.email,
            subject: 'Tutor Product Response',
            html: message
        }); */
    }
    // copy params to product and save
    Object.assign(product, params);
    product.updated = Date.now();
    await product.save();

    return basicDetails(product);
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
    const product = await getApplication(id);
    await product.remove();
}

// helper functions

async function getApplication(id) {
    if (!db.isValidId(id)) throw 'Product not found';
    const product = await db.Product.findById(id);
    if (!product) throw 'Product not found';
    return product;
}

function basicDetails(product) {
    const { id, name, price, supplier, status, created } = product;
    return { id, name, price, supplier, status, created };
}
