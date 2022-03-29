const express= require ("express");
const jwt= require ("jsonwebtoken");

const app= express();
app.listen(3000,function(){
    console.log("nodej runniun")
});

app.get('/compras1/:cod_compra',(req,res)=>{
    const {cod_compra} =req.params;
    
    const query =`CALL select_compra (?);`
    mysqlconnection.query(query,[cod_compra],(err,rows,fields )=> {
      
        if (!err){
            res.json(rows[0]);

        }else {
            console.log(err);
        }
    })

jwt.sign({cod_compra:cod_compra}), 'secretkey', (err,token)=> {

    res.json({
        token:token
    })
}

}); 


jwt.sign({cod_compra:cod_compra}), 'secretkey', (err,token)=> {

    res.json({
        token:token
    })
}