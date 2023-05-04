function sendEmail(e) {
    e.preventDefault();

    const fromEmail = document.getElementById('from').value;
    const toEmail = document.getElementById('to').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    var confirmation = document.getElementById('confirmedSentEmail');

    Email.send({
        SecureToken : "7180543f-dd62-40b2-8525-83ba2d3cb4ae",
        To : toEmail,
        From : fromEmail,
        Subject : subject,
        Body : message
    }).then(
        confirmation.style.opacity = '1',
        setTimeout(() => {
            // 👇️ make confirmation element visible.
            confirmation.style.opacity = '0';
          }, 5000) // 5 seconds.        
    );
}