$(document).ready(function () {
    $('#loadScreen').fadeOut();
    $("#radio_1").prop("checked", true);
    $("#comp_dateInput").css("display", "block");
    $("#comp_idOtclosed").css("display", "none");
    $("#comp_resultByDateRange").css("display", "none");
    $("#comp_resultById").css("display", "none");

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
        $("#comp_resultByDateRange").css("display", "none");
    });
    $('#dateInput').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('YYYY-MM-DD HH:mm:ss') + ' - ' + picker.endDate.format('YYYY-MM-DD HH:mm:ss'));
    });
});
let startDate, endDate;
let currentDate = moment();
$('input[type=radio][name="optradio"]').on('change', function () {
    switch (this.value){
        case '1':
            $("#comp_dateInput").css("display", "block");
            $("#comp_idOtclosed").css("display", "none");           
            $("#comp_resultById").css("display", "none");           
            break;
        case '2':
            $("#comp_dateInput").css("display", "none");
            $("#comp_resultByDateRange").css("display", "none"); 
            $("#comp_idOtclosed").css("display", "block");
            break;
    };
})
// Buscar materiales usados en un rango de fecha
$('#date_searchOTclosed').click(function(){
    let inputContent = $("#dateInput").val();
    console.log("bien fai");
    if (inputContent != "") {
        let data = {
            'startDate': startDate,
            'endDate': endDate
        }
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchByDate',
                'parameters': JSON.stringify(data)
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function (data) {
            if(data.type === 'success'){
                let html=''
                let resultData = data.data
                if(resultData.length != 0){
                    console.log(data)
                    html += `<div class="row">`
                    resultData.forEach(function(item){
                        html += `<dt class="col-sm-8"> ${item.fk_material__nombre_mat}:</dt>
                                 <dd class="col-sm-4"> ${item.suma_total}</dd>`
                    })
                    html += `</div>`
                    $("#date_resultmaterials").html(html);
                    $("#comp_resultByDateRange").css("display", "block");
                }
                else{
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se usaron materiales en este rango de fecha',
                        icon: 'error'
                    });
                }
            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: 'No se logró obtener materiales usados',
                    icon: 'error'
                });
            }
        })
    }
    else {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Por favor seleccione un rango de fecha',
            confirmButtonText: 'Aceptar'
        });
    }
});
// Buscar materiales por ID orden
$('#id_searchOTclosed').click(function(){
    let idClosedOt = $('#idOtclosed').val();
    if (idClosedOt != ""){
        $.ajax({
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchById',
                'parameters': idClosedOt
            },
            beforeSend: function () {
                $("#loadScreen").fadeIn();
            },
            complete: function () {
                $('#loadScreen').fadeOut();
            },
        }).done(function (data) {
            $("#comp_resultById").css("display", "block"); 
            let html= ''
            if (data.type ==='error') {
                Swal.fire({
                    title: 'Error!',
                    text: 'No se encontraron materiales para esta orden.',
                    icon: 'error'
                });
            } else {
                let listMaterials = JSON.parse(data.data);
                html += `<div class="row">`
                listMaterials.forEach(function(item) {
                    html += `<dt class="col-sm-8"> ${item.fk_material__nombre_mat}:</dt>
                             <dd class="col-sm-4"> ${item.cantidad}</dd>`
                    console.log(item.fk_material__nombre_mat);
                    console.log(item.cantidad);
                });
                html += `</div>`
                $("#id_resultmaterials").html(html);
            }
        })
    }
    else {
        Swal.fire({
            icon: 'warning',
            title: 'Error',
            text: 'Por favor escriba el número de una orden',
            confirmButtonText: 'Aceptar'
        });
    }
})

