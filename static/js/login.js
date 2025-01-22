document.addEventListener("DOMContentLoaded", function () {
    // Check if there are any form errors and display them using SweetAlert
    const formErrors = document.querySelector("#formErrors").value;
    if (formErrors) {
        Swal.fire({
            title: 'Error!',
            text: formErrors,
            icon: 'error'
        });
    }

    // Function to show/hide the password
    document.querySelector(".input-group-text").addEventListener("click", function () {
        const passwordInput = document.getElementById("id_password");
        const passwordIcon = document.querySelector(".icon");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
        } else {
            passwordInput.type = "password";
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
        }
    });
});