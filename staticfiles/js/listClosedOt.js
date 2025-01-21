// LOADER
$(document).ready(function () {
    $('#loadScreen').fadeOut();
});
let startDate, endDate, table, rowData;
let currentDate = moment();

$('#dateInput').daterangepicker({
    autoUpdateInput: false,
    timePicker: true,
    timePicker24Hour: true,
    locale: {
        format: 'YYYY-MM-DD HH:mm:ss',
        cancelLabel: 'Limpiar',
        applyLabel: 'Aplicar'
    },
    maxDate: currentDate
    }, function(start, end, label){
        startDate =start.format('YYYY-MM-DD HH:mm:ss');
        endDate =end.format('YYYY-MM-DD HH:mm:ss');
});
$('#dateInput').on('cancel.daterangepicker', function(ev, picker) {
    $(this).val('');
    $(this).trigger('change');
    let tableClosedOT = $('#tableData').DataTable();
    tableClosedOT.clear().draw();
});
$('#dateInput').on('apply.daterangepicker', function(ev, picker) {
    $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm:ss') + ' - ' + picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
});
$('#searchOTclosed').click(function() {
    let inputContent = $("#dateInput").val();
    if (inputContent != "") {
        let data = {
            'startDate': startDate,
            'endDate': endDate
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'getOtClosed',
                'parameters': JSON.stringify(data)
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function(data){
            if (data.type == "error"){
                $('#loadScreen').fadeOut();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.msg,
                    confirmButtonText: 'Aceptar'
                });
            } else {
                console.log(data.data)
                $('#response_data').show();
                let data_table = $('#tableData').DataTable({
                    autoWidth:  false,
                    destroy: true,
                    scrollX: true,
                    dom: 'Bfrtilp',
                    deferRender: true,
                    sAjaxDataProp: "",
                    data: data.data,
                    buttons: [
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fas fa-file-excel"></i> Excel',
                            titleAttr: 'Exportar a Excel',
                            className: 'btn btn-dark btn-sm',
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                            titleAttr: 'Exportar a PDF',
                            className: 'btn btn-dark btn-sm',
                        },
                    ],
                    columns:[
                        { 'data': 'id__ordenes'},
                        { 'data': 'fecha_cierre'},
                        { 'data': 'nombre_tipo_orden'},
                        { 'data': 'Medio' },
                        { 'data': 'telefono_factura'},
                        { 
                            "targets": -1,  // Última columna
                            "data": null,
                            "defaultContent": "<button id='btn_details' type='button' class='btn btn-danger btn-sm'><i class='fa-regular fa-square-plus'></i></button>"
                        },
                    ]
                });
                show_otdetails("#tableData tbody", data_table)
            }
        })
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Por favor seleccione un rango de fecha',
            confirmButtonText: 'Aceptar'
        });
    }
});
function show_otdetails(tbody, table){
    $(tbody).on("click", "#btn_details", function(){
        try{
            rowData = table.row($(this).closest('tr')).data();
            if(rowData['id__ordenes'] === undefined){
                throw new Error("No fue posible consular los detalles de la orden.")
            }
            tr = $(this).closest('tr');
            row = table.row(tr);
            $.ajax({
                url: window.location.pathname,
                type: 'POST',
                data: {
                    'action': 'reportMaterials',
                    'parameters': rowData['id__ordenes']
                },
                success: function(data){
                    if (row.child.isShown()) {
                        row.child.hide();
                        tr.removeClass('shown');
                    } else {
                        row.child(format(data)).show();
                        tr.addClass('shown');
                    }
                }
            }); 
        } catch (error) {}
    })   
}
function format(d){
    try{
        let html = ''
        // llaves y valores traidos de la view, para renderizar el child row
        let keys = Object.keys(d);
        let values = Object.values(d);
        let fill_and_parameters = values[values.length -1];
        let fill = fill_and_parameters["imagen"].toString();
        let parameters = JSON.parse(fill_and_parameters["parametros"]);
        html+= `<div class="card">
                    <div class="card-header bg-dark">
                        <i class="fa-solid fa-file-signature"></i> <b>INFORMACIÓN ORDEN CERRADA</b>
                    </div>
                    <div class="card-body">
                        <div class="card p-2">
                            <div class="row">
                                <div class="col-sm-4"><b>Recibido por:</b> ${parameters["nombre"]}</div>
                                <div class="col-sm-4"><b>Cédula:</b> ${parameters["identificacion"]}</div>
                                <div class="col-sm-4"><b>Teléfono contacto:</b> ${parameters["telefonoContacto"]}</div>
                            </div>
                        </div>
                        <div class="card p-2">
                            <div class="row">`
                                $.each(Object.entries(parameters["parameters"]), function(index, [key,value]){
                                    html += `<div class="col-sm-4"> <b>${key}:</b> ${value}</div>`    
                                })  
        html+=              `</div>
                        </div>
                        <img id="fill_image" src="${fill}" class="img-fluid">
                    </div>
                </div>`
        html += `<div class="card">
                    <div class="card-header bg-dark">
                        <i class="fa-solid fa-boxes-stacked"></i> <b>MATERIALES USADOS</b>
                    </div>
                    <div class="card-body">
                        <div class="row">`
                            keys.forEach(function(key, index) {
                                if (index !== keys.length - 1) {
                                html += `<div class="col-sm-4"><b>${d[key].name}</b>: ${d[key].quantity}</div>`;
                                }
                            });
        html+=          `</div>
                    </div>
                </div>`
        return html;
    }  catch (Error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No fue posible obtener la información de esta orden.',
            confirmButtonText: 'Aceptar'
        });
    }
}
