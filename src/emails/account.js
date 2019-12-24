const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY) // SET api key

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'd.joseph@cruiseline.eu',
        subject: "Merci d'avoir rejoint la communauté !",
        text: `Bienvenue dans l'app ${name}. ` // es6 template string feature
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'd.joseph@cruiseline.eu',
        subject: 'Nous sommes désolé de votre départ',
        text: `Bonjour ${name}, pouvez-vous nous indiquez pourquoi vous nous quittez ?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}