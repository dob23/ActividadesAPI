$(document).ready(function () {
    //PRINCIPAL
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'totalProductsSales',
            'option': 'all'
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function (data) {            
        if (data.type =='error'){
            Swal.fire({
                title: data.msg,
                icon: 'warning'
            });
            return;
        }
            //TOTAL PRODUCTOS
            var arrLb = [];
            var arrBA = [];
            var arrIPTV = [];
            //MESES
            var arrrMes = [];
            var mesesNumerados = [
                "NA",
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
            ];
            //RECORRER ARREGLO PARA BUSCAR EL TOTAL DE LOS PRODUCTO  
            data.data.forEach(function (productos) {
                switch (productos.tipoProducto) {
                    case '1':
                            arrLb.push(parseInt(productos.total));
                            arrrMes.push(mesesNumerados[productos.mes])
                        break;
                    case '2':
                            arrBA.push(parseInt(productos.total));
                        break;
                    case '3':
                            arrIPTV.push(parseInt(productos.total));
                        break;
                }
            });
            //ZONA DE LA GRAFICA QUE MOSTRARA LOS DATOS
            Highcharts.chart('containerTotalProducts', {
                title: {
                    text: 'Total De Ventas Productos Segmento Hogar'
                },
                subtitle: {
                    text: 'Ultimo año'
                },
                yAxis: {
                    title: {
                        text: 'Cantidad de productos'
                    }
                },
                xAxis: {
                    categories: arrrMes,
                    accessibility: {
                        description: 'Meses ultimo año'
                    }
                    
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        },
                        pointStart: 0
                    }
                },
                series: [
                    {
                        name: 'VOZ',
                        data: arrLb,
                            color: 'green'
                    },
                    {
                        name: 'INTERNET',
                        data: arrBA,
                        color: 'blue'
                    },
                    {
                        name: 'TV',
                        data: arrIPTV,
                        color: 'red'
                    }
                ],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }

            });
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })
    //POR CANAL
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'totalProductsSales',
            'option': 'channel'
        },
        beforeSend: function () {
            $("#loadScreen").fadeIn();
        },
        complete: function () {
            $('#loadScreen').fadeOut();
        },
    }).done(function (data) {            
        if (data.type =='error'){
            Swal.fire({
                title: data.msg,
                icon: 'warning'
            });
            return;
        }
        //MESES BASE
        var mesesNumerados = ["NA", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        //METAS INTERNET X MES Y AÑO
        var objMetaInternet = {
            2023 : [0,2100,2100,2700,2880,4500,4500,3960,3480,4320,3600,2040,1700],
            2024 : [0, 368, 368, 1472, 3312, 4048, 4048, 4048, 4048, 4048, 4048, 3680, 3312],
            2025 : [0, 368, 368, 1472, 3312, 4048, 4048, 4048, 4048, 4048, 4048, 3680, 3312],
            2026 : [0, 368, 368, 1472, 3312, 4048, 4048, 4048, 4048, 4048, 4048, 3680, 3312]
        }
        //METAS IPTV X MES Y AÑO
        var objMetaIptv = {
            2023 : [0,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200,1200],
            2024 : [0,0,478,718,2153,2631,2631,2631,2631,2870,2631,2631,1914],
            2025 : [0,0,478,718,2153,2631,2631,2631,2631,2870,2631,2631,1914],
            2026 : [0,0,478,718,2153,2631,2631,2631,2631,2870,2631,2631,1914],
        }
        //METAS VOZ X MES Y AÑO
        var objMetaVoz = {
            2023 : [0,1300,1500,1560,1980,2100,2150,2230,1920,1860,1860,1440,1300],
            2024 : [0,773,773,773,1030,1159,1159,1159,1288,1288,1288,1288,902],
            2025 : [0,773,773,773,1030,1159,1159,1159,1288,1288,1288,1288,902],
            2026 : [0,773,773,773,1030,1159,1159,1159,1288,1288,1288,1288,902],
        }
        //CANALES INTERNET
        var arrECOMMERCE = [];
        var arrEMCALI = [];
        var arrCENTROATENCION = [];
        var arrCONTACCENTER = [];
        var arrVIR = [];
        var datosAgrupados = {};
        //CANALES IPTV
        var arrECOMMERCEIPTV = [];
        var arrEMCALIIPTV = [];
        var arrCENTROATENCIONIPTV = [];
        var arrCONTACCENTERIPTV = [];
        var arrVIRIPTV = [];
        var datosAgrupadosIPTV = {};
        //CANALES VOZ
        var arrECOMMERCEVOZ = [];
        var arrEMCALIVOZ = [];
        var arrCENTROATENCIONVOZ = [];
        var arrCONTACCENTERVOZ = [];
        var arrVIRVOZ = [];
        var datosAgrupadosVOZ = {};
        //SUMER LOS ECOMERCE
        data.data.forEach(function (productos) {
            switch (productos.tipoProducto) {
                case '2':
                        //MES
                        var clave = productos.ano;
                        //VALIDAR SI EXISTE EL ANO
                        if (!datosAgrupados[clave]) {
                            datosAgrupados[clave] = [];
                        }
                        //VALIDAR SI EXISTE EL ME
                        if (!datosAgrupados[clave].includes(productos.mes)) {
                            //arregloSinDuplicados.push(elemento);
                            datosAgrupados[clave].push(productos.mes);
                        }
                        //VALIDAR DATOS POR AREA
                        switch (productos.id__areas) {
                            case '6':
                                arrCENTROATENCION.push(parseInt(productos.total));
                                break;
                            case '7':
                                arrCONTACCENTER.push(parseInt(productos.total));
                                break;
                            case '57':
                                arrVIR.push(parseInt(productos.total));
                                break;
                            case '62':
                                arrECOMMERCE.push(parseInt(productos.total));
                                break;
                            case '47':
                                arrEMCALI.push(parseInt(productos.total));
                                break;
                        }
                break;
                case '3':
                        //MES
                        var clave = productos.ano;
                        //VALIDAR SI EXISTE EL ANO
                        if (!datosAgrupadosIPTV[clave]) {
                            datosAgrupadosIPTV[clave] = [];
                        }
                        //VALIDAR SI EXISTE EL ME
                        if (!datosAgrupadosIPTV[clave].includes(productos.mes)) {
                            //arregloSinDuplicados.push(elemento);
                            datosAgrupadosIPTV[clave].push(productos.mes);
                        }
                        //VALIDAR DATOS POR AREA
                        switch (productos.id__areas) {
                            case '6':
                                arrCENTROATENCIONIPTV.push(parseInt(productos.total));
                                break;
                            case '7':
                                arrCONTACCENTERIPTV.push(parseInt(productos.total));
                                break;
                            case '57':
                                arrVIRIPTV.push(parseInt(productos.total));
                                break;
                            case '62':
                                arrECOMMERCEIPTV.push(parseInt(productos.total));
                                break;
                            case '47':
                                arrEMCALIIPTV.push(parseInt(productos.total));
                                break;
                        }
                break;
                case '1':
                        //MES
                        var clave = productos.ano;
                        //VALIDAR SI EXISTE EL ANO
                        if (!datosAgrupadosVOZ[clave]) {
                            datosAgrupadosVOZ[clave] = [];
                        }
                        //VALIDAR SI EXISTE EL ME
                        if (!datosAgrupadosVOZ[clave].includes(productos.mes)) {
                            //arregloSinDuplicados.push(elemento);
                            datosAgrupadosVOZ[clave].push(productos.mes);
                        }
                        //VALIDAR DATOS POR AREA
                        switch (productos.id__areas) {
                            case '6':
                                arrCENTROATENCIONVOZ.push(parseInt(productos.total));
                                break;
                            case '7':
                                arrCONTACCENTERVOZ.push(parseInt(productos.total));
                                break;
                            case '57':
                                arrVIRVOZ.push(parseInt(productos.total));
                                break;
                            case '62':
                                arrECOMMERCEVOZ.push(parseInt(productos.total));
                                break;
                            case '47':
                                arrEMCALIVOZ.push(parseInt(productos.total));
                                break;
                        }
                break;
            }
        });
        //PINTAR META Y MES INTERNET
        arrMesAux = [];
        arrMesMeta = [];
        for (const clave in datosAgrupados) {
            //VALIDAR DATOS SI HAY DATOS EN CLAVE
            if (datosAgrupados[clave]) {
                const auxArr = datosAgrupados[clave];
                auxArr.forEach(function(elemento) {
                    arrMesAux.push(mesesNumerados[elemento]);
                    arrMesMeta.push(objMetaInternet[clave][elemento]);
                });
                
            }
        }
        //PINTAR META Y MES IPTV
        arrMesAuxIPTV = [];
        arrMesMetaIPTV = [];
        for (const clave in datosAgrupadosIPTV) {
            //VALIDAR DATOS SI HAY DATOS EN CLAVE
            if (datosAgrupadosIPTV[clave]) {
                const auxArr = datosAgrupadosIPTV[clave];
                auxArr.forEach(function(elemento) {
                    arrMesAuxIPTV.push(mesesNumerados[elemento]);
                    arrMesMetaIPTV.push(objMetaIptv[clave][elemento]);
                });
                
            }
        }
        //PINTAR META Y MES VOZ
        arrMesAuxVOZ = [];
        arrMesMetaVOZ = [];
        for (const clave in datosAgrupadosVOZ) {
            //VALIDAR DATOS SI HAY DATOS EN CLAVE
            if (datosAgrupadosVOZ[clave]) {
                const auxArr = datosAgrupadosVOZ[clave];
                auxArr.forEach(function(elemento) {
                    arrMesAuxVOZ.push(mesesNumerados[elemento]);
                    arrMesMetaVOZ.push(objMetaVoz[clave][elemento]);
                });
                
            }
        }
        //PINTAR
        Highcharts.chart('containerBa', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ventas Internet Por Canal',
                align: 'left'
            },
            xAxis: {
                categories: arrMesAux
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'ECOMMERCE',
                    data: arrECOMMERCE
                },{
                    name: 'EMCALI',
                    data: arrEMCALI
                },{
                    name: 'Centros de atencion',
                    data: arrCENTROATENCION
                },{
                    name: 'Contac center',
                    data: arrCONTACCENTER
                },{
                    name: 'VIR 2021',
                    data: arrVIR
                },
                {
                    type: 'spline',
                    name: 'Meta',
                    data: arrMesMeta,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    }
                }
            ]
        });
        //PINTAR IPTV
        Highcharts.chart('containerIptv', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ventas IPTV Por Canal',
                align: 'left'
            },
            xAxis: {
                categories: arrMesAux
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'ECOMMERCE',
                    data: arrECOMMERCEIPTV
                },{
                    name: 'EMCALI',
                    data: arrEMCALIIPTV
                },{
                    name: 'Centros de atencion',
                    data: arrCENTROATENCIONIPTV
                },{
                    name: 'Contac center',
                    data: arrCONTACCENTERIPTV
                },{
                    name: 'VIR 2021',
                    data: arrVIRIPTV
                },
                {
                    type: 'spline',
                    name: 'Meta',
                    data: arrMesMetaIPTV,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    }
                }
            ]
        });
        //PINTAR VOZ
        Highcharts.chart('containerLb', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Ventas Voz Por Canal',
                align: 'left'
            },
            xAxis: {
                categories: arrMesAux
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Count trophies'
                },
                stackLabels: {
                    enabled: true
                }
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: 'ECOMMERCE',
                    data: arrECOMMERCEVOZ
                },{
                    name: 'EMCALI',
                    data: arrEMCALIVOZ
                },{
                    name: 'Centros de atencion',
                    data: arrCENTROATENCIONVOZ
                },{
                    name: 'Contac center',
                    data: arrCONTACCENTERVOZ
                },{
                    name: 'VIR 2021',
                    data: arrVIRVOZ
                },
                {
                    type: 'spline',
                    name: 'Meta',
                    data: arrMesMetaVOZ,
                    marker: {
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[3],
                        fillColor: 'white'
                    }
                }
            ]
        });
    }).fail(function (textStatus, errorThrown) {
        alert(textStatus + ': ' + errorThrown);
    })
});