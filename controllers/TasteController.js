const { create } = require('domain');
const { PrismaClient } = require('../generated/prisma');
const { error } = require('console');
const { update } = require('./FoodTypeController');
const prisma = new PrismaClient();

module.exports = {
    create: async (req,res) => {
        try{
            await prisma.taste.create({
                data: {
                    name: req.body.name,
                    remark:req.body.remark,
                    foodTypeId: req.body.foodTypeId,
                    status:"use",
                },
            });
            return res.send({ message: "create taste success"});
        }
        catch(e){
            return res.status(500).send({ error: e.message})
        }
    },
    list: async(req,res)=>{
        try{    
            const rows = await prisma.taste.findMany({
                include:{
                    FoodType:true, 
                },
                orderBy:{
                    id:"desc",
                },
                where:{
                    status: "use",
                },
            })
            return res.send({ results: rows})
        }catch(e){
            return res.status(500).send({ error: e.message})
        }
    },
    remove: async(req,res) => {
        try{
            await prisma.taste.update({
                data: {
                    status: "delete",

                },
                where: {
                    id: parseInt(req.params.id),
                },
            })
            return res.send({ message: "remove success"});
        }catch(e){
            return res.status(500).send({ error: e.message})
        }
    },
    update: async (req,res)=>{
        try{
            await prisma.taste.update({
                data:{
                    foodTypeId:req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                },
                where: {
                    id: req.body.id,
                }
            })
            return res.send({ message: "update success"})
        }catch(e){
            return res.status(500).send({ error: e.message})
        }
    }

}