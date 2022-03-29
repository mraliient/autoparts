const mysql=require('mysql');
const jwt= require ("jsonwebtoken");
require("dotenv").config();

const express=require ('express');
const { CLIENT_LONG_PASSWORD } = require('mysql/lib/protocol/constants/client');

const app= express ();
const bp=require ('body-parser');
const { verify } = require('jsonwebtoken');

//enviar datos json a nodejs api
app.use(bp.json());

//conexion base de datos
var mysqlconnection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database :'autoparts',
    multipleStatements :true

})


//test conexion base
mysqlconnection.connect((err)=>{
    if(!err) {
        console.log('conexion exitosa');
    } else {
        console.log('error al conectar a la base de datos');
    }

});

//puerto especifico
app.listen(3000, ()=> console.log('server running puerto: 3000'))

//ruta
app.get('/persona/:id_nombre',(req,res)=>{
    const {id_nombre} =req.params;
    vonsole.log(req.body)
    const query =`CALL select_persona (?);`
    mysqlconnection.query(query,[id_nombre],(err,rows,fields )=> {
      
        if (!err){
            res.json.parse(rows[0]);

        }else {
            console.log(err);
        }
    })


});

//verificar usuario exisrte en base de datos




app.post('/api/login',(req,res)=>{
    const user={
   cod_usuario:1,
   nombre_usuario: "admin",
     correo_usuario: "pbaueba@gmail.com",
     activo: "Si",
     dtype: "admin",
     "roles": [
        {
            "id": 1,
            "name": "admin",
            "role": "ADMIN",
            "master": true
        }
    ],
    }
    
    jwt.sign({user},'secretkey',{expiresIn:"35s"},(err,token)=>{
       
        res.json({
             token
            }
        );

    } );


});

app.post('/api/reporte',verifytoken,(req,res)=>{
  
   jwt.verify(req.token, 'secretkey',(error,authData)=>{
       if(error){
           res.sendStatus(403);
       }else{
           res.json({
               mensaje:"creado",
               authData:authData
           })
       }
   });

});

function verifytoken(req,res,next){
   const bearerHeader= req.headers['authorization'];

   if(typeof bearerHeader !=='undefined'){
       const bearerToken=bearerHeader.split(" ")[1];
       req.token=bearerToken;
       next();
   }else{
    res.sendStatus(403);
   }
}

//rutas

//modulo compra

//compras

//select compras
app.get('/compras/:cod_compra',verifytoken,(req,res)=>{
    const {cod_compra} =req.params;
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const query =`CALL select_compra (?);`
            mysqlconnection.query(query,[cod_compra],(err,rows,fields )=> {
              
                if (!err){
                    res.json(rows[0]);
        
                }else {
                    console.log(err);
                }
            })
        }
    });

 

});


//insertar compra
app.post('/compras',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_compra ,cod_proveedores,cod_usuario,cod_modelo,bin_carro,fecha_compra,precio_compra}=req.body;

            console.log(req.body)
            const query=` CALL insert_compras(?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_compra ,cod_proveedores,cod_usuario,cod_modelo,bin_carro,fecha_compra,precio_compra],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

    


});
//update compra
app.put('/update_compras/:cod_compra',verifytoken,(req,res)=>{
     
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_proveedores,cod_usuario,cod_modelo,bin_carro,fecha_compra,precio_compra}=req.body;
            const {cod_compra}= req.params;
            console.log(req.body)
            const query=` CALL update_compra(?,?,?,?,?,?,?);` ;
               mysqlconnection.query(query,[cod_compra ,cod_proveedores,cod_usuario,cod_modelo,bin_carro,fecha_compra,precio_compra],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'dato actualizado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });
   

});

//delete compra
app.delete('/delete_compras/:cod_compra',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_compra}= req.params;
    console.log(req.body)
    const query=` CALL delete_compra(?);` ;
       mysqlconnection.query(query,[cod_compra],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });
    

});





//detalle_compra
app.post('/detalle_compra',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {id_detalle_compra,cod_compra,cod_pieza,serial_pieza,cantidad,ubc_pieza,precio_compra}=req.body;
            console.log(req.body)
            const query=` CALL insert_detalle_compra(?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[id_detalle_compra,cod_compra,cod_pieza,serial_pieza,cantidad,ubc_pieza,precio_compra],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'dato agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   


});

//update detalle_compra
app.put('/update_detalle_compra/:id_detalle_compra',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_compra,cod_pieza,serial_pieza,cantidad,ubc_pieza,precio_compra}=req.body;
    const {id_detalle_compra}= req.params;
    console.log(req.body)
    const query=` CALL update_detalle_compra(?,?,?,?,?,?,?);` ;
       mysqlconnection.query(query,[id_detalle_compra,cod_compra,cod_pieza,serial_pieza,cantidad,ubc_pieza,precio_compra],(err,rows,fields )=> {

        if (!err){
            res.json({status:'dato actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});


//proveedores
app.post('/proveedores',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_proveedor,proveedor ,contacto,telefono,direccion}=req.body;
            console.log(req.body)
            const query=` CALL insert_proveedores (?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_proveedor,proveedor ,contacto,telefono,direccion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   


});

//update proveedores
app.put('/update_proveedores/:cod_proveedor',verifytoken,(req,res)=>{

    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {proveedor ,contacto,telefono,direccion}=req.body;
            const {cod_proveedor}= req.params;
            console.log(req.body)
            const query=` CALL update_proveedores(?,?,?,?,?);` ;
               mysqlconnection.query(query,[cod_proveedor,proveedor ,contacto,telefono,direccion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'dato actualizado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   

});


//pieza
app.post('/pieza',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_pieza,cod_modelo,id_tipo_pieza,precio_pieza,img_pieza,usr_modificacion,fecha_modificacion}=req.body;
            console.log(req.body)
            const query=` CALL insert_pieza(?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_pieza,cod_modelo,id_tipo_pieza,precio_pieza,img_pieza,usr_modificacion,fecha_modificacion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   


});
//update pieza
app.put('/update_pieza/:cod_pieza',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_modelo,id_tipo_pieza,precio_pieza,img_pieza,usr_modificacion,fecha_modificacion}=req.body;
    const {cod_pieza}= req.params;
    console.log(req.body)
    const query=` CALL update_pieza(?,?,?,?,?,?,?);` ;
       mysqlconnection.query(query,[cod_pieza,cod_modelo,id_tipo_pieza,precio_pieza,img_pieza,usr_modificacion,fecha_modificacion],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});

//delete pieza
app.delete('/delete_pieza/:cod_pieza',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_pieza}= req.params;
    console.log(req.body)
    const query=` CALL delete_pieza(?);` ;
       mysqlconnection.query(query,[cod_pieza],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });

   

});



//tipo_pieza

app.post('/tipo_pieza',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {id_tipo_pieza ,descripcion}=req.body;
    console.log(req.body)
    const query=` CALL insert_tipo_pieza(?,?);
    ` ;
       mysqlconnection.query(query,[id_tipo_pieza ,descripcion],(err,rows,fields )=> {

        if (!err){
            res.json({status:'agregado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    


});

app.put('/update_tipo_pieza/:id_tipo_pieza',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {descripcion}=req.body;
            const {id_tipo_pieza}= req.params;
            console.log(req.body)
            const query=` CALL update_tipo_pieza(?,?);` ;
               mysqlconnection.query(query,[id_tipo_pieza ,descripcion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'actualizado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   

});


//modelo 

app.post('/modelo',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_modelo ,marca,modelo,año,tipo}=req.body;
            console.log(req.body)
            const query=` CALL insert_modelo(?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_modelo ,marca,modelo,año,tipo],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   


});

//update modelo
app.put('/update_modelo/:cod_modelo',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            
    const {marca,modelo,año,tipo}=req.body;
    const {cod_modelo}= req.params;
    console.log(req.body)
    const query=` CALL update_modelo(?,?,?,?,?);` ;
       mysqlconnection.query(query,[cod_modelo ,marca,modelo,año,tipo],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });


});

//delete modelo
app.delete('/delete_modelo/:cod_modelo',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_modelo}= req.params;
    console.log(req.body)
    const query=` CALL delete_modelo(?);` ;
       mysqlconnection.query(query,[cod_modelo],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});



//modulo ventas
//ventas
app.post('/insert_ventas',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_venta ,cod_factura,cod_usuario,fecha_venta}=req.body;
            console.log(req.body)
            const query=` CALL insert_ventas(?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_venta ,cod_factura,cod_usuario,fecha_venta],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });




});

//update detalle_venta
app.put('/update_ventas/:cod_venta',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            
    const {cod_factura,cod_usuario,fecha_venta}=req.body;
    const {cod_modelo}= req.params;
    console.log(req.body)
    const query=` CALL update_ventas(?,?,?,?);` ;
       mysqlconnection.query(query,[cod_venta ,cod_factura,cod_usuario,fecha_venta],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });


});

//delete ventas
app.delete('/delete_ventas/:cod_venta',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_modelo}= req.params;
    console.log(req.body)
    const query=` CALL delete_ventas(?);` ;
       mysqlconnection.query(query,[cod_venta],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});

//detalle_ventas
app.post('/insert_detalle_venta',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {id_detalle_venta ,cod_pieza ,cod_venta ,cantidad}=req.body;
            console.log(req.body)
            const query=` CALL insert_detalle_venta(?,?,?,?);
            ` ;
               mysqlconnection.query(query,[id_detalle_venta ,cod_pieza ,cod_venta ,cantidad],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

});
//update detalle_venta
app.put('/update_detalle_venta/:id_detalle_venta',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            
    const { cod_pieza ,cod_venta ,cantidad}=req.body;
    const {id_detalle_venta}= req.params;
    console.log(req.body)
    const query=` CALL update_detalle_venta(?,?,?,?);` ;
       mysqlconnection.query(query,[id_detalle_venta ,cod_pieza ,cod_venta ,cantidad],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });


});

//factura
app.post('/insert_factura',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_factura,cod_venta,total,fecha,subtotal,isv,descuento,rtn,nombre,fecha_vencimiento}=req.body;
            console.log(req.body)
            const query=` CALL insert_factura(?,?,?,?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_factura,cod_venta,total,fecha,subtotal,isv,descuento,rtn,nombre,fecha_vencimiento],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

});

//update_factura
app.put('/update_factura/:cod_factura',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            
    const { cod_venta,total,fecha,subtotal,isv,descuento,rtn,nombre,fecha_vencimiento}=req.body;
    const {cod_factura}= req.params;
    console.log(req.body)
    const query=` CALL update_detalle_venta(?,?,?,?,?,?,?,?,?,?);` ;
       mysqlconnection.query(query,[cod_factura,cod_venta,total,fecha,subtotal,isv,descuento,rtn,nombre,fecha_vencimiento],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });

});

//ddelete factura
app.delete('/delete_factura/:cod_factura',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_factura}= req.params;
    console.log(req.body)
    const query=` CALL delete_factura(?);` ;
       mysqlconnection.query(query,[cod_factura],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });

});

//autorizacion descuento
app.post('/insert_autorizacion_descuento',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_descuento ,cod_factura ,cod_usuario ,autentificacion}=req.body;
            console.log(req.body)
            const query=` CALL insert_autorizacion_descuento(?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_descuento ,cod_factura ,cod_usuario ,autentificacion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

});

//update autorizacion descuento
app.put('/update_autorizacion_descuento/:cod_descuento',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            
    const { cod_factura ,cod_usuario ,autentificacion}=req.body;
    const {cod_descuento}= req.params;
    console.log(req.body)
    const query=` CALL update_autorizacion_descuento(?,?,?,?);` ;
       mysqlconnection.query(query,[cod_descuento ,cod_factura ,cod_usuario ,autentificacion],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });


});


//modelo seguridad



//Usuarios
app.post('/usuario',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_usuario,cod_compra,nombre_usuario,apellido_usuario,correo_usuario,password_usuario,reseteo_clave,fecha_creacion,fecha_modificacion,ultima_conexion,tel_usuario,direccion_usuario,creado_por,modificado_por}=req.body;
            console.log(req.body)
            const query=` CALL insert_usuarios(?,?,?,?,?,?,?,?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_usuario,cod_compra,nombre_usuario,apellido_usuario,correo_usuario,password_usuario,reseteo_clave,fecha_creacion,fecha_modificacion,ultima_conexion,tel_usuario,direccion_usuario,creado_por,modificado_por],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   


});

app.put('/update_usuarios/:cod_usuario',verifytoken,(req,res)=>{

    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_compra,nombre_usuario,apellido_usuario,correo_usuario,password_usuario,reseteo_clave,fecha_creacion,fecha_modificacion,ultima_conexion,tel_usuario,direccion_usuario,creado_por,modificado_por}=req.body;
            const {cod_usuario}= req.params;
            console.log(req.body)
            const query=` CALL update_usuarios(?,?,?,?,?,?,?,?,?,?,?,?,?,?);` ;
               mysqlconnection.query(query,[cod_usuario,cod_compra,nombre_usuario,apellido_usuario,correo_usuario,password_usuario,reseteo_clave,fecha_creacion,fecha_modificacion,ultima_conexion,tel_usuario,direccion_usuario,creado_por,modificado_por],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'actualizado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

  

});

app.delete('/delete_usuarios/:cod_usuario',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_usuario}= req.params;
            console.log(req.body)
            const query=` CALL delete_usuarios(?);` ;
               mysqlconnection.query(query,[cod_usuario],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'borrado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

  

});

//bitacora
app.post('/bitacora',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {id_bitacora,cod_usuario,fecha,accion,descripcion}=req.body;
            console.log(req.body)
            const query=` CALL insert_bitacora(?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[id_bitacora,cod_usuario,fecha,accion,descripcion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   


});

app.put('/update_bitacora/:id_bitacora',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_usuario,fecha,accion,descripcion}=req.body;
    const {id_bitacora}= req.params;
    console.log(req.body)
    const query=` CALL update_bitacora(?,?,?,?,?);` ;
       mysqlconnection.query(query,[id_bitacora,cod_usuario,fecha,accion,descripcion],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});

app.delete('/delete_bitacora/:id_bitacora',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {id_bitacora}= req.params;
    console.log(req.body)
    const query=` CALL 	delete_bitacora(?);` ;
       mysqlconnection.query(query,[id_bitacora],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});

//historial_contrasena
app.post('/hist',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {id_hist,cod_usuario,password,creado_por,fecha_creacion,modificado_por,fecha_modificacion}=req.body;
            console.log(req.body)
            const query=` CALL insert_historia_contrasena(?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[id_hist,cod_usuario,password,creado_por,fecha_creacion,modificado_por,fecha_modificacion],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

});

app.put('/update_hist/:id_hist',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_usuario,password,creado_por,fecha_creacion,modificado_por,fecha_modificacion}=req.body;
    const {id_hist}= req.params;
    console.log(req.body)
    const query=` CALL update_historia_contrasena(?,?,?,?,?,?,?);` ;
       mysqlconnection.query(query,[id_hist,cod_usuario,password,creado_por,fecha_creacion,modificado_por,fecha_modificacion],(err,rows,fields )=> {

        if (!err){
            res.json({status:'actualizado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});


// Inventario

//Delete Inventario
app.delete('/delete_inventario/:cod_inventario',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_inventario}= req.params;
    console.log(req.body)
    const query=` CALL 	delete_inventario(?);` ;
       mysqlconnection.query(query,[cod_inventario],(err,rows,fields )=> {

        if (!err){
            res.json({status:'borrado'});

        }else {
            console.log(err);
        }
    })
        }
    });

    

});

//Update inventario
app.put('/update_inventario/:cod_inventario',verifytoken,(req,res)=>{

    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_pieza, cod_compra, cod_venta, stock, detalle}=req.body;
            const {cod_inventario}= req.params;
            console.log(req.body)
            const query=` CALL update_inventario(?,?,?,?,?);` ;
               mysqlconnection.query(query,[cod_inventario, cod_piez, cod_compra, cod_venta, stock, detalle],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'dato actualizado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    });

   

});


//Insert Inventario
app.post('/inventario',verifytoken,(req,res)=>{
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const {cod_inventario, cod_pieza, cod_compra, cod_venta, cod_producto, stock, detalle, inv_minimo, inv_maximo, fch_registro, usr_registro}=req.body;

            console.log(req.body)
            const query=` CALL insert_inventario(?,?,?,?,?,?,?);
            ` ;
               mysqlconnection.query(query,[cod_inventario, cod_pieza, cod_compra, cod_venta, cod_producto, stock, detalle, inv_minimo, inv_maximo, fch_registro, usr_registro],(err,rows,fields )=> {
        
                if (!err){
                    res.json({status:'agregado'});
        
                }else {
                    console.log(err);
                }
            })
        }
    
    });

});

//Select Inventario
app.get('/inventario/:cod_inventario',verifytoken,(req,res)=>{
    const {cod_inventario} =req.params;
    jwt.verify(req.token, 'secretkey',(error,authData)=>{
        if(error){
            res.sendStatus(403);
        }else{
            const query =`CALL select_inventario (?);`
            mysqlconnection.query(query,[cod_inventario, cod_pieza, cod_compra, cod_venta, cod_proveedor],(err,rows,fields )=> {
              
                if (!err){
                    res.json(rows[0]);
        
                }else {
                    console.log(err);
                }
            })
        }
    });

}); 