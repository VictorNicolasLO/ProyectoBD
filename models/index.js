

var dba;

var exp = {
    load: (db) => {
        dba = db;
        /*var Producto = db.model({ table: 'PRODUCTO' });
        var prod = Producto({
            Nombre: 'bob',
            receta: "asdf",
            id_producto: 11223,
            precio: 123213,

        });
        prod.save((resolve) => {
            console.log("asdf");
            console.log(resolve);

        }).then((resolved) => {
            console.log("asdf1");
            console.log(resolve);

        }, (resolve) => {
            console.log("asdf");
            console.log(resolve);

        });*/



        /*db.query("select * from Producto").then(function (records) {
            console.log(records)
        });*/
        exp['AREA_VENTA'] = generateModel('AREA_VENTA');
        exp['VENTA'] = generateModel('VENTA');


        exp['VENTA'].find = (opt, cb) => {
            dba.query("select (select v.ID_VENTA,FECHA,STATUS,MONTO,Nombre from VENTA v left join REPORTE_VENTA rv on rv.ID_VENTA = v.ID_VENTA left join VENTA_PRODUCTO vp on rv.ID_REPORTE_VENTA  = vp.ID_REPORTE_VENTA left join PRODUCTO  p on p.ID_PRODUCTO = vp.ID_PRODUCTO FOR JSON AUTO  ) as js").then(function (records) {
                records = JSON.parse(records[0]["js"]);
                for (var i = 0; i < records.length; i++) {
                    records[i].productos = "";
                    records[i].monto =  records[i].rv[0].MONTO;
                    for (var j = 0; j < records[i].rv[0].p.length; j++) {
                        if (records[i].rv[0].p[j].Nombre)
                            records[i].productos += records[i].rv[0].p[j].Nombre + ((j < records[i].rv[0].p.length - 1) ? ", " : "")
                    }
                    delete records[i].rv;
                }
                cb(records)
            });
        }


        exp['VENTA_PRODUCTO'] = generateModel('VENTA_PRODUCTO');

        exp['VENTA_PRODUCTO'].create = (data, cb) => {
            var model = dba.model({ table: 'VENTA_PRODUCTO'});
                var saved = false, modified = false


                var obj = model(data, {
                    saved,
                    modified
                });

                var ent = obj.identity()
                obj.save().then(() => {
                    cb(undefined, obj);
                }, (err) => {
                    cb(err, undefined);
                });
            

        }

        exp['PRODUCTO'] = generateModel('PRODUCTO');
        exp['PROVEEDOR'] = generateModel('PROVEEDOR');
        exp['PROMOCION'] = generateModel('PROMOCION');
        exp['SUCURSAL'] = generateModel('SUCURSAL');
        exp['EMPLEADO'] = generateModel('EMPLEADO');
        exp['INSUMO'] = generateModel('INSUMO');
        exp['ORDEN'] = generateModel('ORDEN');
        exp['PRODUCTO_INSUMO'] = generateModel('PRODUCTO_INSUMO');
        exp['PRODUCTO'].find = (opt, cb) => {
            dba.query("select p.ID_PRODUCTO,p.Nombre,p.Precio,p.Receta,i.NOMBRE_INSUMO from producto p left join PRODUCTO_INSUMO pi on pi.ID_PRODUCTO = p.ID_PRODUCTO left join INSUMO i on i.ID_INSUMO = pi.ID_INSUMO FOR JSON AUTO").then(function (records) {
                records = JSON.parse(records[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"]);
                for (var i = 0; i < records.length; i++) {
                    records[i].insumos = "";

                    for (var j = 0; j < records[i].i.length; j++) {
                        if (records[i].i[j].NOMBRE_INSUMO)
                            records[i].insumos += records[i].i[j].NOMBRE_INSUMO + ((j < records[i].i.length - 1) ? ", " : "")
                    }
                    delete records[i].i;
                }
                cb(records)
            });
        }

        exp['query'] = (query, cb) => {
            db.query(query).then(function (records) {
                cb(records)
            });
    },
    generateModel
    }
}

module.exports = exp;

function generateModel(name) {

    var model = dba.model({ table: name, id: "ID_" + name });

    var complete = {
        create: (data, cb) => {
            complete.count((count) => {
                var saved = false, modified = false
                if (data["ID_" + name] || data["id_" + name] || data["Id_" + capitalizeFirstLetter(name.toLowerCase())] || data["ID_" + capitalizeFirstLetter(name.toLowerCase())]) {
                    modified = true
                    saved = true;
                    if (!data["ID_" + name])
                        data["ID_" + name] = data["ID_" + capitalizeFirstLetter(name.toLowerCase())]
                }
                else {
                    data["ID_" + name] = count + 1;
                }


                var obj = model(data, {
                    saved,
                    modified
                });

                var ent = obj.identity()
                obj.save().then(() => {
                    cb(undefined, obj);
                }, (err) => {
                    cb(err, undefined);
                });
            })

        },
        find: (opt, cb) => {
            dba.query("select " + (opt.select || "*") + " from " + name + (opt.extra || "")).then(function (records) {
                cb(records)
            });
        },
        count: (cb) => {
            dba.query("select max(" + "ID_" + name + ") as count from " + name).then(function (records) {
                cb(records[0].count)
            });
        },
        delete: (id, cb) => {
            dba.query("delete from " + name + " where id_" + name + "=" + id).then(function (records) {
                cb({ message: records })
            });
        }

    }
    return complete;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}