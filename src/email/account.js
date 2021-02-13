const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')


const sendWelcomeMail = (email, name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'urveshnimavat57@gmail.com', // Change to your verified sender
        subject: 'Thanks for Joining in',
        text: `Welcome to the Compnay, ${name}. Let me know how can I help you?`,
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
      
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendCancelationMail = (email, name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'urveshnimavat57@gmail.com', // Change to your verified sender
        subject: 'Sorry to See you Go.',
        text: `Welcome to the Compnay, ${name}. Let me know how can I help you?`,
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
      
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports={
    sendWelcomeMail,
    sendCancelationMail
}