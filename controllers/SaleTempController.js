const { create } = require('domain');
const { PrismaClient } = require('../generated/prisma');
const { clear } = require('console');
const { update } = require('./FoodTypeController');
const prisma = new PrismaClient();

module.exports = {
    create: async (req, res)=>{
        try{
            const row = await prisma.food.findFirst({
                where:{
                    id: req.body.foodId,
                },
            });
            const oldData = await prisma.saleTemp.findFirst({
                where:{
                    foodId: req.body.foodId
                }
            });  

            if(oldData == null){
                await prisma.saleTemp.create({
                    data:{
                        foodId: req.body.foodId,
                        qty: req.body.qty,
                        price: row.price,
                        userId: req.body.userId,
                        tableNo: req.body.tableNo,
                    }
                });
                return res.send({ message: "Create Sale Temp success"});
            }else{
                await prisma.saleTemp.update({
                    data:{
                        qty: oldData.qty + 1,
                    },
                    where:{
                        id: oldData.id,
                    }
                })
            }

        }catch(e){
            return res.status(500).send({ error : e.message});
        }
    },
    list: async (req,res) =>{
        try{
            const rows = await prisma.saleTemp.findMany({
                include:{
                    Food: true,
                    SalTempDetails: true, 
                },
                where:{
                    userId: parseInt(req.params.userId),
                },
                orderBy:{
                    id:"desc",
                }
            });
            return res.send({ results: rows});
        }catch(e){
            return res.status(500).send({ error : e.message});
        }
    },
    clear: async(req,res)=>{
        try{
            await prisma.saleTemp.deleteMany({
                where:{
                    userId: parseInt(req.params.userId),
                },
            })

            return res.send({ message: "success"});
        }catch(e){
            return res.status(500).send({error:e.message});
        }

    },
    remove: async (req,res)=>{
        try{
            await prisma.saleTemp.deleteMany({
                where:{
                    foodId: parseInt(req.params.foodId),
                    userId: parseInt(req.params.userId),
                },
            })
            return  res.send({ message : "rempoove sale success"  })
        }catch(e){
            return res.status(500).send({error:e.message});
        }
    },
    changeQty: async(req,res)=>{
        try{
            const oldData = await prisma.saleTemp.findFirst({
                where:{
                    id: req.body.id
                }
            })

            const oldQty = oldData.qty;

            if(req.data.style == 'down'){
                oldQty = oldQty - 1;
                if(oldQty < 0){
                    oldQty = 0;    
                }
            }else{
                oldQty = oldQty + 1;
            }

            await prisma.saleTemp.update({
                data:{
                    qty: old
                },
                where:{
                    id: req.body.id
                }
            })


            return res.send({ message: "changeQty success"})
        }catch(e){
            return res.status(500).send({error:e.message});
        }
    },

    createDeatil: async (req,res) =>{
        try{
            const qty = req.body.qty;
            const foodId = req.body.foodId;
            const saleTempId = req.body.saleTempId;

            const oldData = await prisma.saleTempDetail.findFirst({
                where: {
                    foodId: foodId,
                    saleTempId: saleTempId
                }
            })

            if(oldData == null){
                for(let i = 0 ; i < qty ; i++){
                        await prisma.saleTempDetail.create({
                            data:{
                                foodId: foodId,
                                saleTempId: saleTempId,
                            }
                        })
                    
                }
            }

            return res.send({ message: "create detail success"});
        }catch(e){
         return res.status(500).send({error:e.message});
        }
    },
    listSaleTempDetail: async(req,res)=>{
        try{
            const rows = await prisma.saleTempDetail.findMany({
               include:{
                    Food:true,
               },
                where:{
                    saleTempId: parseInt(req.params.saleTempId)
                },
                orderBy:{
                    id: 'desc'
                }
            }); 
            return res.send({ results : rows});
        }catch(e){
            return res.status(500).send({error:e.message});
        }
    },

    updateFoodSize: async(req,res)=>{
        try{
            const foodSize = await prisma.foodSize({
                where:{
                    id: req.body.foodSizeId,
                },
            });

            await prisma.saleTempDetail.update({
                data:{
                    addedMoney: foodSize.moneyAdded,
                },
                where:{
                    id: req.body.saleTempId,
                },
            });

            return res.send({ message: "update foodsize success"});
        }catch(e){
            return res.status(500).send({error:e.message});
        }
    }


   
}