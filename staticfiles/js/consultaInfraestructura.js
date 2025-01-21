// START
$(document).ready(function () {
    //CHECK POR DEFAULT
    $("#radio_1").prop("checked", true);
    // PRINT RESPONSE DIV AT BEGINNING
    var strPrintout='';
    strPrintout += `<div class="form-group" id="response_input">
                        <label for="name">FIBRA OPTICA</label>
                        <input type="text" name="input_search" id="input_search"  class="form-control input-sm" placeholder="Ingrese el numero para consultar Fibra" minlength="1">
                    </div>`;
    $("#response_input").html(strPrintout);
    $('#loadScreen').fadeOut();  
});
// RADIO BUTTONS WITH RESPONSE DIV
$('input[type=radio][name="optradio"]').on('change', function () {
    var strPrintout='';
    switch (this.value){
        case '1':
            strPrintout += `<div class="form-group" id="response_input">
                                <label for="name">FIBRA OPTICA</label>
                                <input type="text" name="input_search" id="input_search"  class="form-control input-sm" placeholder="Ingrese el numero para consultar Fibra" minlength="1">
                            </div>`;
            $("#response_input").html(strPrintout);
          break;
        case '2':
            strPrintout += `<div class="form-group" id="response_input">
                                <label for="name">N1</label>
                                <input type="text" name="input_search" id="input_search"  class="form-control input-sm" placeholder="Ingrese el numero N1" minlength="1">
                            </div>`;
            $("#response_input").html(strPrintout);
          break;
        case '3':
            strPrintout += `<div class="form-group" id="response_input">
                                <label for="name">N2</label>
                                <input type="text" name="input_search" id="input_search"  class="form-control input-sm" placeholder="Ingrese el numero N2" minlength="1">
                            </div>`;
            $("#response_input").html(strPrintout);
          break;
        case '4':
            $("#response_input").html(strPrintout);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'listCentral',
                },
                beforeSend: function() {
                    $("#loadScreen").fadeIn('fast');
                },
                complete: function () {
                    $('#loadScreen').fadeOut('fast');
                },
            }).done(function (data) {
                if (data.type === 'success') {
                    strPrintout += `<div class="form-group" id="response_input">
                                        <div class="row">
                                            <label for="name">CENTRAL</label>
                                            <select class="form-control select2" id="input_search" data-live-search="true">
                                            </select>
                                        </div>
                                     </div>`;
                $("#response_input").html(strPrintout);
                for (var x in data.data) {
                    $('#input_search').append('<option value="' + data.data[x]['id__central'] + '">' + data.data[x]['nombre_central'] + '</option>');
                }
                // SELECT2
                $('#input_search').select2({
                    theme: 'bootstrap4'
                });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.msg,
                        icon: 'error'
                    }); 
                }
            }).fail(function (textStatus, errorThrown) {
                alert(textStatus + ': ' + errorThrown);
            })
          break;
    }
    $("#response_unit").html(strPrintout);
});

// CONSULT BUTTON
$('#btn_buscar').on('click', function () {
    var radio = $('input[name="optradio"]:checked').val();
    var arrData = new Object();
    // CUANDO ES FIBRA
    if (radio == 1){
        arrData.fk_gestion__transporte = "=5";
        arrData.res_plantside=`REGEXP '${input_search.value}'`;
        console.log(JSON.stringify(arrData));
    }
    // CUANDO ES N1
    if (radio == 2){
        arrData.fk_gestion__transporte = "=5"
        arrData.res_tono=`REGEXP '${input_search.value}'`;
        console.log(JSON.stringify(arrData));
    }
    // CUANDO ES N2
    if (radio == 3){
        arrData.fk_gestion__transporte = "=5";
        arrData.res_combinado=`REGEXP '${input_search.value}'`;
        console.log(JSON.stringify(arrData));
    }
    // CUANDO ES CENTRAL
    if (radio == 4){
        arrData.fk_gestion__transporte = "=5";
        arrData.id__central = `REGEXP '${input_search.value}'`;
        console.log(JSON.stringify(arrData));    
    };      
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'listInfrastructureSearchFtth',
            'parameters': JSON.stringify(arrData)
        },
        beforeSend: function() {
            $("#loadScreen").fadeIn('fast');
        },
        complete: function () {
            $('#loadScreen').fadeOut('fast');
        },
    }).done(function (data) {
        if (data.type === 'success') {
            $('#response_data').show();
            $('#tableData').DataTable({
                info: false,
                autoWidth:  false,
                destroy: true,
                scrollX: true,
                pageLength: 20,
                data: data.data,
                columns: [
                    {
                        data: null,
                        render: function (data, type, row, meta) {
                            return meta.row + 1;
                        }
                    },
                    {'data':'telefono_factura'},
                    {'data':'suscriptor'},
                    {'data':'nombre_cliente'},
                    {'data':'telefono_contacto'},
                    {'data':'tipo_cliente'},
                    {'data':'TipoServicio'},
                    {'data':'direccion'},
                    {'data':'fecha_instalacion'},
                    {'data':'hilo_fibra'},
                    {'data':'N1'},
                    {'data':'POSICION_N1'},
                    {'data':'N1_DIRECCION'},
                    {'data':'N2'},
                    {'data':'POSICION_N2'},
                    {'data':'N2_DIRECCION'},
                    {'data':'potenciaCdo'},
                    {'data':'OLT'},
                    {'data':'tarjeta'},
                    {'data':'puerto'},
                    {'data':'instancia'},
                    {'data':'velocidad'},
                    {'data':'nombre_plan'},
                ]
            });
        } else if (data.type === 'error') {
            Swal.fire({
                title: 'Error!',
                text: data.msg,
                icon: 'error'
            }); 
        }
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })
});
