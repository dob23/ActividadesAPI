
// VALIDACION MATERIALES | PASO 3
function materialsValidation() {
    return new Promise(function(resolve, reject) {
        const form = document.getElementById("materials_form");
        if (form.checkValidity() === false) {
            form.classList.add("was-validated");
            reject();
        } else {
            form.classList.remove("was-validated");
            resolve();
        }
    });
}

