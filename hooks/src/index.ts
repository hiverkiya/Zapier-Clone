import express from "express"
const app=express();
// https://hooks.zapier.com/hooks/catch/24045762/u49e6si/
app.post("/hooks/catch/:userId/:zapId",(req,res)=>{
    const userId=req.params.userId;
    const zapId=req.params.zapId;
    //store a trigger in a DB
    //push triggers in a queue (kafka/redis)
})