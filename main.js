// Initialize EmailJS with your public key
(function () {
    emailjs.init("uoka4YBRThoa5PM9m");
})();

document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('.contact-input');
    var loader = document.getElementById('loading');
    var modal = document.getElementById('messageModal');
    var modalMessage = document.getElementById('modal-message');
    var closeModal = document.getElementsByClassName('close')[0];

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Form validation
        if (!validateForm()) {
            showModal('Please fill in all required fields and agree to the privacy policy.');
            return;
        }

        // Show loader with sending image
        loader.style.display = 'flex';

        // Collect form data
        var name = event.target.name.value;
        var email = event.target.email.value;
        var subject = event.target.subject.value;
        var message = event.target.message.value;

        // Prepare the data object for the main email
        var templateParams = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };

        // Send the main email using EmailJS
        emailjs.send('service_vf3y2mf', 'template_qidjlnm', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                // Send the auto-reply email
                var autoReplyParams = {
                    name: name,
                    email: email
                };

                return emailjs.send('service_vf3y2mf', 'template_r8m6byc', autoReplyParams);
            })
            .then(function (response) {
                console.log('Auto-reply sent!', response.status, response.text);
                loader.style.display = 'none';
                showModal('Message and auto-reply sent successfully!');
                form.reset(); // Clear the form
            })
            .catch(function (error) {
                console.error('FAILED...', error);
                loader.style.display = 'none';
                showModal('Failed to send message. Please try again later.');
            });
    });

    // Close modal when the user clicks the close button
    closeModal.onclick = function () {
        modal.style.display = "none";
    }

    // Close modal when the user clicks anywhere outside of the modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Show the modal with a message
    function showModal(message) {
        modalMessage.innerText = message;
        modal.style.display = "block";
    }

    function validateForm() {
        var email = form.email.value.trim();
        var message = form.message.value.trim();
        var consentChecked = document.getElementById('consent').checked;

        if (email === "" || message === "" || !consentChecked) {
            return false;
        }

        // Basic email validation
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showModal('Please enter a valid email address.');
            return false;
        }

        return true;
    }
});
