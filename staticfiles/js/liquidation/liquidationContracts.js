// LOADER
$(document).ready(function () {
    $('#loadScreen').fadeOut();
});
let startDate, endDate, valorTotalMonetario, valorTotalMonetarioParsed;
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
    $('#cardValorTotal').hide();
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
                $('#cardValorTotal').show();
                valorTotalMonetario = data.valortotal
                valorTotalMonetarioParsed = valorTotalMonetario.toLocaleString('es-CO', {style:'currency', currency: 'COP'});
                $('#valortotal').html(valorTotalMonetarioParsed);
                $('#response_data').show();
                $('#tableData').DataTable({
                    info: false,
                    pageLength: 100,
                    autoWidth:  false,
                    destroy: true,
                    scrollX: true,
                    dom: 'Bfrtilp',
                    deferRender: true,
                    sAjaxDataProp: "",
                    data: data.data,
                    buttons: [
                        {
                            extend: 'copyHtml5',
                            text: '<i class="fas fa-clipboard"></i> Copiar',
                            titleAttr: 'Copiar en portapapeles',
                            className: 'btn btn-secondary btn-sm',
                        },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="fas fa-file-excel"></i> Excel',
                            titleAttr: 'Exportar a Excel',
                            className: 'btn btn-success btn-sm',
                        },
                        {
                            extend: 'pdfHtml5',
                            text: '<i class="fa-solid fa-file-pdf"></i> PDF',
                            titleAttr: 'Exportar a PDF',
                            className: 'btn btn-danger btn-sm',
                        },
                    ],
                    columns:[
                        { 'data': 'id__ordenes'},
                        { 'data': 'telefono_factura'},
                        { 'data': 'suscriptor'},
                        { 'data': 'instalador' },
                        { 'data': 'nameActividad' },
                        { 'data': 'fechaCierre' },
                        { 'data': 'dias_transcurridos' },
                        { 'data': 'numeroVecesCola' },
                        { 'data': 'tiempoColaTotal' },
                        { 'data': 'tiempoImputableContratista' },
                        { 'data': 'porcentaje' },
                        { 'data': 'valor' },
                    ],
                    columnDefs: [
                        {
                            targets: [-1],
                            class: 'text-center',
                            orderable: false,
                            render: function (data, type, row) {
                                return `$ ${data.toLocaleString("es-CO")}`;
                            }
                        },
                    ]
                })
            } ;   
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus + ': ' + errorThrown);
        });
    } else {
        console.log("Selecciona un rango de fechas primero");
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Por favor seleccione un rango de fecha',
            confirmButtonText: 'Aceptar'
        });
    }
});
