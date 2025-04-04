document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("8ixomQhHl_J5j-fLH"); // Replace with YOUR_PUBLIC_KEY

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(contactForm);
            const formValues = {
                name: formData.get("name"),
                email: formData.get("email"),
                subject: formData.get("subject"),
                message: formData.get("message")
            };

            // Send email using EmailJS
            emailjs.send("service_pwxjohm", "template_i3vwuvk", formValues)
                .then(function(response) {
                    console.log("Email sent successfully!", response);

                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
                    successMessage.style.color = 'var(--terminal-green)';
                    successMessage.style.padding = '15px';
                    successMessage.style.marginTop = '15px';
                    successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                    successMessage.style.borderRadius = '4px';

                    contactForm.appendChild(successMessage);

                    // Clear the form
                    contactForm.reset();

                    // Remove the message after 5 seconds
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                })
                .catch(function(error) {
                    console.error("Email sending failed!", error);

                    // Show error message
                    alert("Failed to send message. Please try again later.");
                });
        });
    }
});
