const nodemailer = require("nodemailer")
const pass = process.env.SENDING_EMAIL_Pass

const createVerificationEmail = (receiverEmail, OTP) => {
    const email = {
        from: '"Scot.io" <gauravmishra99696@gmail.com>',
        to: receiverEmail,
        subject: "Email Verification",
        text: "This is a verification Email from Scot.",
        html: `<h3>Your OTP for verification is ${OTP.OTP}. Valid for 10 minutes.</h3>`,
    };
    return email;
};

const sendMail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            // servise: "gmail",
            service: "gmail", 
            auth: {
                user: "scot2449@gmail.com",
                pass: "mgmm tbes nbit ttbr"
            }
        });
        return transporter.sendMail(email, (err) => {
            if(err){
                console.log(err);
            }
        })
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = {
    createVerificationEmail,
    sendMail
}