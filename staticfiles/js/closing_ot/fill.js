$(document).ready(function() {
    const canvas = $('#signature')[0];
    const ctx = canvas.getContext('2d', {willReadFrequently:true});
    let writingMode = false;
    let lastPosition = null;
    let signatureBase64 = null;

    const clearPad = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    const getCursorPosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        return { x, y };
    }
    const drawLine = (x1, y1, x2, y2) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    // Validar si la firma es lo suficientemente larga para habilitar el botón de guardar
    function validateSignature() {
        let signatureData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let isSignatureValid = false;
        // Recorremos los píxeles de la firma en busca de trazos
        for (let i = 0; i < signatureData.length; i += 4) {
            // Verificamos si el píxel tiene algún color distinto de blanco (255, 255, 255)
            if (signatureData[i] !== 255 || signatureData[i + 1] !== 255 || signatureData[i + 2] !== 255) {
                isSignatureValid = true;
                break;
            }
        }
        $('#saveBtn').prop('disabled', !isSignatureValid);
        if (isSignatureValid) {
            // Si la firma es válida, guardarla en la variable signatureBase64
            signatureBase64 = canvas.toDataURL(); // Convierte el canvas a base64
        }
    }
    // Manejador del evento cuando se toca la pantalla o se presiona el ratón en el lienzo
    const handleDownEvent = (event) => {
        event.preventDefault();
        writingMode = true;
        lastPosition = getCursorPosition(event);
    }
    // Manejador del evento cuando se mueve el dedo o el ratón en el lienzo
    const handleMoveEvent = (event) => {
        event.preventDefault();
        if (!writingMode) return;
        let currentPosition;
        // Comprobamos si es un evento táctil o de ratón
        if (event.touches && event.touches.length > 0) {
            currentPosition = getCursorPosition(event.touches[0]);
        } else {
            currentPosition = getCursorPosition(event);
        }
        drawLine(lastPosition.x, lastPosition.y, currentPosition.x, currentPosition.y);
        lastPosition = currentPosition;

        validateSignature(); // Validar la firma mientras se dibuja
    }

    // Manejador del evento cuando se levanta el dedo o se suelta el ratón en el lienzo
    const handleUpEvent = () => {
        writingMode = false;
    }

    // Agregar los eventos táctiles y de ratón al lienzo
    $(canvas).on('mousedown', handleDownEvent);
    $(canvas).on('mousemove', handleMoveEvent);
    $(canvas).on('mouseup', handleUpEvent);
    $(canvas).on('touchstart', handleDownEvent);
    $(canvas).on('touchmove', handleMoveEvent);
    $(canvas).on('touchend', handleUpEvent);

    // Agregar el evento para limpiar el lienzo al hacer clic en el botón "Limpiar firma"
    $('#clearBtn').on('click', function(event) {
        event.preventDefault();
        clearPad();
        $('#saveBtn').prop('disabled', true);
    });
    // Validacion formulario para ejecutar el cierre de la orden en main.js
    $('#saveBtn').on('click', async function(event) {
        event.preventDefault();
        const closing_form = document.getElementById("closing_form");
    
        if (closing_form.checkValidity()) {
            if (signatureBase64) {
                window.sessionStorage.setItem("signature", signatureBase64);
                closeOT();
            } else {
                Swal.fire({
                    title: '¡Alerta!',
                    text: 'Debe realizar una firma para continuar con el cierre de la orden.',
                    icon: 'warning'
                });
            }
        } else {
            const invalidElements = closing_form.querySelectorAll(':invalid');
            for (const element of invalidElements) {
                const formGroup = element.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('was-validated');
                }
            }
            Swal.fire({
                title: '¡Alerta!',
                text: 'Debe completar todos los campos correctamente para cerrar la orden.',
                icon: 'warning'
            });
        }
    }); 
});


  