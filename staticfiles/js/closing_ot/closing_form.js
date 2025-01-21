const checkTypeOt = sessionStorage.getItem("checkTypeOt"); // VALIDAR SI LA ORDEN ES DE INSTALACION O MANTENIMIENTO
let html = '';

// INSTALACION
if(checkTypeOt == 0){
    if(sessionStorage.getItem("idTipoOrden") == 16){
        html +=`<label for="content_activities">ACTIVIDADES REALIZADAS</label>
                <div class="row" id="content_activities">
                    <div class="form-check form-group col-sm-6">
                        <input class="form-check-input" type="radio" name="optionItemCambioMedio" value="1" checked> Instalacion Fibra DROP + ONT
                    </div>
                    <div class="form-check form-group col-sm-6">
                        <input class="form-check-input" type="radio" name="optionItemCambioMedio" value="2"> Instalacion de ONT
                    </div>
                </div>
                <br>`
    }
    $("#itemsCambioMedio").html(html);
}
// MANTENIMIENTO (GARANTIA O REPARACION)
else {
    const $reparacionDiv = $("<div>", {
        "class": "form-group col-12 col-sm-6 col-md-6 col-lg-4",
        html: `
            <label for="reparacion">Código de reparación:</label>
            <select class="select2" name="reparacion" id="reparacion" data-live-search="true">
                <option value=0>Seleccione un código</option>
            </select>
        `
    });
    const $causaDiv = $("<div>", {
        "class": "form-group col-12 col-sm-6 col-md-6 col-lg-4",
        html: `
            <label for="causa"> Código causal de falla:</label>
            <select class="select2" name="causa" id="causa" data-live-search="true">
                <option value=0>Seleccione un código</option>
            </select>
        `
    });
    const $localizacionDiv = $("<div>", {
        "class": "form-group col-12 col-sm-6 col-md-6 col-lg-4",
        html: `
            <label for="localizacion">Código localización de falla:</label>
            <select class="select2" name="localizacion" id="localizacion" data-live-search="true">
                <option value=0>Seleccione un código</option>
            </select>
        `
    });
    $("#fields_smqrOT").append($reparacionDiv, $causaDiv, $localizacionDiv);
    
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'getRepairCodes'
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function(data){
        appendOptions("#reparacion", data.codigo_reparacion);
        appendOptions("#causa", data.codigo_falla);
        appendOptions("#localizacion", data.codigo_localizacion);
    });
    function appendOptions(selector, dataArray) {
        const $select = $(selector);
        for (const item of dataArray) {
            $select.append(`<option value="${item.codigo}">${item.codigo} | ${item.nombre}</option>`);
        }
    };
    $('.select2').select2({
        theme: 'bootstrap4'
    });
}
