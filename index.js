const express = require('express');
const fs = require('fs');
const logger = require('./logger/winston').logger
const app = express();

app.use(express.json());




app.get("/",(req,res)=>{
    res.send("server running")
})

app.post("/save",(req,res)=>{
    const content = req.body.content;

    try {
    fs.writeFileSync("req_data.json",JSON.stringify(content),(err)=>{
            if(err){console.log(err)
            }
        });
        
    } catch (err) {
        logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.send({status:false, message: "failed", error: err.message})

        
    }


    res.send({status:true, message: "success"})



    
})

app.listen(3030,()=>{
    console.log('server running')
})