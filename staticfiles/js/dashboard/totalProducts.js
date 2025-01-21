$(document).ready(function () {
    $.ajax({
        url: window.location.pathname,
        type: 'POST',
        data: {
            'action': 'totalProducts',
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
                    case 'LB':
                            arrLb.push(parseInt(productos.total));
                            arrrMes.push(mesesNumerados[productos.mes])
                        break;
                    case 'BA':
                            arrBA.push(parseInt(productos.total));
                        break;
                    case 'IPTV':
                            arrIPTV.push(parseInt(productos.total));
                        break;
                }
            });
            //ZONA DE LA GRAFICA QUE MOSTRARA LOS DATOS
            Highcharts.chart('containerTotalProducts', {
                title: {
                    text: 'Total Productos Segmento Hogar'
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
            //CRECIMIENTO
            var crecimientoLb = [];
            var crecimientoBa = [];
            var crecimientoIptv = [];
            for (let i = 0; i < arrLb.length; i++) {
                //LB
                if (arrLb[i]!=0) {
                    crecimientoLb.push(parseInt(arrLb[i]-arrLb[i-1]));
                }
                //BA
                if (arrBA[i]!=0) {
                    crecimientoBa.push(parseInt(arrBA[i] - arrBA[i - 1]));
                }
                //IPTV
                if (arrIPTV[i]!=0) {
                    crecimientoIptv.push(parseInt(arrIPTV[i]-arrIPTV[i-1]));
                }
            }
            //LB
            Highcharts.chart('containerLb', {
                title: {
                    text: 'Crecimiento VOZ'
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
                        data: crecimientoLb,
                        color: 'green'
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
            //BA
            Highcharts.chart('containerBa', {
                title: {
                    text: 'Crecimiento INTERNET'
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
                        name: 'INTERNET',
                        data: crecimientoBa,
                        color: 'blue'
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
            //IPTV
            Highcharts.chart('containerIptv', {
                title: {
                    text: 'Crecimiento TV'
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
                        name: 'TV',
                        data: crecimientoIptv,
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
});
