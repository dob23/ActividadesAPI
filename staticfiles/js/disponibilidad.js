//INICIO
$(document).ready(function () {
    //OCULTAR EL LOADER
    $('#loadScreen').fadeOut();
    //CHECK POR DEFAULT
    $("#radio_1").prop("checked", true);
    $("#UNIDAD").val('NO');
});
//OPCIONES
$('input[type=radio][name="optradio"]').on('change', function () {
    var strPrintout='';
    $("#response").html('');
    switch (this.value){
        case '1':
            strPrintout += '';
            $("#UNIDAD").val('NO');
            $("#CITI").prop("disabled", false);
            $("#TIPO_DE_VIA").prop("disabled", false);
            $("#NOMBRE_NUMEROS_LETRAS_VIA").prop("disabled", false);
            $("#NOMBRE_NUMEROS_LETRAS_VIA").val('');
            $("#PREFIJO_SECTOR_GEOGRAFICO").prop("disabled", false);
            $("#NUMEROS_LETRAS_VIA_GENERADORA").prop("disabled", false);
            $("#NUMEROS_LETRAS_VIA_GENERADORA").val('');
            $("#SUFIJO_SECTOR_GEOGRAFICO").prop("disabled", false);
            $("#NUMERO_DE_PLACA").prop("disabled", false);
            $("#NUMERO_DE_PLACA").val('');
            $("#UNIDAD").prop("disabled", false);
            $("#GRUPO").val('');
            $("#TERMINAL").val('');
          break;
        case '2':
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'listUnitFtthRural',
                },
                beforeSend: function () {
                    $("#loadScreen").fadeIn();
                },
                complete: function () {
                    $('#loadScreen').fadeOut();
                },
            }).done(function (data) {
                console.warn(data);
                if (data.type === 'success') {
                    strPrintout += `<div class="form-group col-sm-12">
                                        <div class="row">
                                            <label for="name">UNIDAD RESIDENCIAL</label>
                                            <select class="form-control select2" id="fk_gestion__central" data-live-search="true">
                                            </select>
                                        </div>
                                    </div>`;
                    $("#response_unit").html(strPrintout);
                    for (var x in data.data) {
                        $('#fk_gestion__central').append('<option value="' + data.data[x]['id__central'] + '">' + data.data[x]['nombre_central'] + '</option>');
                    }
                    $("#CITI").prop("disabled", true);
                    $("#TIPO_DE_VIA").prop('disabled', 'disabled');
                    $("#NOMBRE_NUMEROS_LETRAS_VIA").prop('disabled', 'disabled');
                    $("#NOMBRE_NUMEROS_LETRAS_VIA").val('');
                    $("#PREFIJO_SECTOR_GEOGRAFICO").prop('disabled', 'disabled');
                    $("#SEPARADOR_NUMERAL").prop('disabled', 'disabled');
                    $("#NUMEROS_LETRAS_VIA_GENERADORA").prop('disabled', 'disabled');
                    $("#NUMEROS_LETRAS_VIA_GENERADORA").val('');
                    $("#SUFIJO_SECTOR_GEOGRAFICO").prop('disabled', 'disabled');
                    $("#SEPARADOR_GUION").prop('disabled', 'disabled');
                    $("#NUMERO_DE_PLACA").prop('disabled', 'disabled');
                    $("#NUMERO_DE_PLACA").val('');
                    $("#UNIDAD").prop('disabled', 'disabled');
                    //ACTIVAR UNIDAD
                    $("#UNIDAD").val('SI');
                    //LIMPIAR CAMPOS
                    $("#TIPO_GRUPO").val('NO');
                    $("#TIPO_TERMINAL").val('NO');
                    $("#GRUPO").val('');
                    $("#TERMINAL").val('');
                    // SELECT2
                    $('#fk_gestion__central').select2({
                        theme: 'bootstrap4'
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error'
                    }); 
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            }).always(function (jqXHR) {
            });
        break;  
    }
    $("#response_unit").html(strPrintout);
});


$('#btn_buscar').on('click', function () {
    //VALIDAR CUAL RADIO BUTTON ESTA SELECCIONADO
    var radio = $('input[name="optradio"]:checked').val();
    var arrData = new Object();
    if (radio == 1) {
        
        arrData.CITI=CITI.value;
        arrData.TIPO_DE_VIA=TIPO_DE_VIA.value;
        arrData.NOMBRE_NUMEROS_LETRAS_VIA=NOMBRE_NUMEROS_LETRAS_VIA.value;
        arrData.PREFIJO_SECTOR_GEOGRAFICO=PREFIJO_SECTOR_GEOGRAFICO.value;
        arrData.SEPARADOR_NUMERAL=SEPARADOR_NUMERAL.value;
        arrData.NUMEROS_LETRAS_VIA_GENERADORA=NUMEROS_LETRAS_VIA_GENERADORA.value;
        arrData.SUFIJO_SECTOR_GEOGRAFICO=SUFIJO_SECTOR_GEOGRAFICO.value;
        arrData.SEPARADOR_GUION=SEPARADOR_GUION.value;
        arrData.NUMERO_DE_PLACA=NUMERO_DE_PLACA.value;
        arrData.UNIDAD=UNIDAD.value;
        arrData.TIPO_GRUPO=TIPO_GRUPO.value;
        arrData.GRUPO=GRUPO.value;
        arrData.TIPO_TERMINAL=TIPO_TERMINAL.value;
        arrData.TERMINAL = TERMINAL.value;
        console.warn(arrData)
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchAvailabilityFTTH',
                'parameters': JSON.stringify(arrData)
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function (data) {
            $("#response").html("");
            if (data.type === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Direccion con cobertura',
                    showConfirmButton: false,
                    timer: 2000
                }); 
                strPrintout='';
                for (var x in data.data.cdo) {
                    strPrintout +=`<div class="row">
                                        <div class="form-group col-sm-12 text-center">
                                            <div><b>DISPONIBILIDAD CDOs PARA PRESTAR EL SERVICIO FTTH</b></div>
                                        </div>
                                        <div class="form-group col-sm-6 text-center">
                                            <label for="name">Codigo de CDO</label>
                                            <input type="text" class="form-control" value="${data.data.cdo[x]['cdo']}" disabled>
                                        </div>
                                        <div class="form-group col-sm-6 text-center">
                                            <label for="name">Puertos Disponibles en la CDO</label>
                                            <input type="text" class="form-control" value="${data.data.cdo[x]['disponibilidad']}" disabled>
                                        </div>
                                    </div>`;
                    //FILA
                    if(data.data.cdo[x]['disponibilidad']==0){
                        Swal.fire({
                            title: 'Error!',
                            text: 'La CDO no tiene puertos disponibles',
                            icon: 'error'
                        });        
                    }
                }
                $("#response").html(strPrintout);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error'
                }); 
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (jqXHR) {
        });
    } else {
        //CUANDO SON UNIDADES
        arrData.fk_gestion__central=fk_gestion__central.value;
        arrData.TIPO_GRUPO=TIPO_GRUPO.value;
        arrData.GRUPO=GRUPO.value;
        arrData.TIPO_TERMINAL=TIPO_TERMINAL.value;
        arrData.TERMINAL = TERMINAL.value;
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchAvailabilityUnitFTTH',
                'parameters': JSON.stringify(arrData)
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function (data) {
            $("#response").html("");
            if (data.type === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Direccion con cobertura',
                    showConfirmButton: false,
                    timer: 2000
                }); 
                strPrintout='';
                for (var x in data.data.cdo) {
                    strPrintout +=`<div class="row">
                                        <div class="form-group col-sm-12 text-center">
                                            <div><b>DISPONIBILIDAD CDOs PARA PRESTAR EL SERVICIO FTTH</b></div>
                                        </div>
                                        <div class="form-group col-sm-6" text-center>
                                            <label for="name">Codigo de CDO</label>
                                            <input type="text" class="form-control" value="${data.data.cdo[x]['cdo']}" disabled>
                                        </div>
                                        <div class="form-group col-sm-6" text-center>
                                            <label for="name">Puertos Disponibles en la CDO</label>
                                            <input type="text" class="form-control" value="${data.data.cdo[x]['disponibilidad']}" disabled>
                                        </div>
                                    </div>`;
                    //FILA
                    if(data.data.cdo[x]['disponibilidad']==0){
                        Swal.fire({
                            title: 'Error!',
                            text: 'La CDO no tiene puertos disponibles',
                            icon: 'error'
                        });        
                    }
                }
                $("#response").html(strPrintout);
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: data.msg,
                    icon: 'error'
                }); 
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        }).always(function (jqXHR) {
        });
    } 
}); 



