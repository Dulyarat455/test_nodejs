const express = require("express");
const app = express();
const bodyParser = require('body-parser');
// const { PrismaClient } = require('@prisma/client');
const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const dotenv  = require("dotenv");
const { error } = require("console");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const cors = require("cors")

dotenv.config();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use("/uploads",express.static("./uploads"))

//require controllers
const userController =  require("./controllers/UserController")
const bookController = require('./controllers/BookController');
const FoodTypeController = require("./controllers/FoodTypeController");
const FoodSizeController = require("./controllers/FoodSizeController");
const tasteController = require("./controllers/TasteController");
const FoodController = require("./controllers/FoodController");
const saleTempController = require("./controllers/SaleTempController");



app.use("/book",bookController);

//upload flie
app.post("book/testUpload", (req, res) =>{
    try{
        const myFile = req.files.myFile;

        myFile.mv("./uploads/" + myFile.name, (err) =>{
            if(err){
                res.status(500).send({ error : err });
            }

            res.send({ message:"success"});
        });
    }catch(e){
        res.status(500).send({ error : e.message });
    }
});

app.get("/readFile", (req, res) =>{
    try{
        const fs = require("fs");
        fs.readFile("test.txt", (err, data) =>{
            if(err){
                throw err;
            }
            res.send(data);
        })
    }catch(e){
        res.status(500).send({ error : e.message });
    }
})

app.get('/writeFile',(req, res) =>{
    try{
        const fs = require("fs");
        fs.writeFile("test.txt","eieiei",(err)=>{
            if (err) {
                throw err;
            }
        });

        res.send({ message: "write file success"});
    }catch(e){
        res.status(500).send({ error : e.message });
    }
})

app.get("/createPdf", (req ,res) =>{
    try{
        const PDFDocument = require("pdfkit");
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream("output.pdf"));
        doc.fontSize(25).text("test export pdf",100,100);
        doc.addPage().fontSize(25).text("here vector graphic...",100,100);
        doc.end();

        res.send({ message:"create pdf succes"})
    }catch(e){
        res.status(500).send({ error : e.message });
    }
})



//*** prisma api
app.get("/book/list", async(req, res) =>{
    const data = await prisma.book.findMany();
    res.send({ data: data });
});

app.post("/book/create", async (req,res) =>{
    const data = req.body;
    const result = await prisma.book.create({
        data: data,
    });
    res.send({ result : result});
});

app.put("/book/update/:id",async (req,res) =>{
    try {
        await prisma.book.update({
            data:{
                isbn: "11111",
                name: "test update",
                price: 900,
            },
            where: {
                id: parseInt(req.params.id),
            },
        });
        res.send({ message : "Edit book success"});
    } catch(e){
        res.status(500).send({ error : e});
    }
});

app.delete("/book/remove/:id" ,async (req,res) =>{
    try{
        await prisma.book.delete({
            where : {
                id : parseInt(req.params.id),
            },
        })
        res.send({ message : "Delete book succes"});
    }catch (e) {
        res.status(500).send({ error : e});
    }
})
app.post("/book/search", async (req,res) =>{
    try{
        const keyword = req.body.keyword;
        const data = await prisma.book.findMany({
            where:{
                name:{
                    contains: keyword,
                }
            }
        })
        res.send({ results: data});
    }catch (e) {
        res.status(500).send({ error : e});
    }
})

app.get("/book/sum",async (req,res) => {
    try{
        const data  = await prisma.book.aggregate({
            _sum: {
                price: true,
            },
        });
        res.send({ result :data})
    }
    catch{
        res.status(500).send({ error : e});
    }
})

//create token
app.get("/user/createToken",(req,res) =>{
    try{
        const secret = process.env.TOKEN_SECRET;
        const payload = {
            id :100,
            name :"kob",
            level : "admin",
        };
        const token = jwt.sign(payload, secret, { expiresIn: "1d"});

        res.send({token : token,secret: secret});
    }catch(e){
        res.status(500).send({ error : e});
    }
})

//decode
app.get('/user/verifyToken', (req,res)=>{
    try{
        const secret = process.env.TOKEN_SECRET;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwLCJuYW1lIjoia29iIiwibGV2ZWwiOiJhZG1pbiIsImlhdCI6MTc2MDUyMDc4MiwiZXhwIjoxNzYwNjA3MTgyfQ.xtNK_6_vVLBbz9udoaPnoHbQXZOI8rwazGZvVsZsrpA"
        const  result = jwt.verify(token,secret);

        res.send({ result: result});
    }catch(e){
        res.status(500).send({ error : e});
    }
})

// Authen
function checkSigngIn(req, res, next){
    try{
        const secret = process.env.TOKEN_SECRET;
        const token = req.headers["authorization"];
        const result = jwt.verify(token, secret);

        if(result != undefined){
            next();
        }
    }catch(e){
        console.log(e);
        res.status(500).send({ error : e.message});
    }
}

app.get("/user/info", checkSigngIn, (req, res, next) => {
    res.send("login Success");
})

app.get("/oneToOne", async (req,res) =>{
    try{
        const data = await prisma.orderDetail.findMany({
            include: {
                book: true,
            },
        })
        res.send({ results : data });
    }catch(e){
        res.status(500).send({ error : e.message });
    }
})

app.get("/oneToMany",async (req,res) =>{
    try{
        const data = await prisma.book.findMany({
            include: {
                orderDetails: true,
            },
        })
        res.send({ results: data })
    }catch(e){
        res.status(500).send({ error : e.message });
    }
})

app.get("/multiModel",async (req,res)=> {
    try{
        const data = await prisma.customer.findMany({
            include: {
                Order: {
                    include: {
                        orderDetail: true,
                    },
                },
            },
        });
        res.send({ result : data })
    }catch(e){
        res.status(500).send({ error : e.message });
    }
})


//********

app.get("/",(req,res) => {
    res.send("hello wold1\n");
});
app.get("/check/:name",(req,res) => {
    res.send("hello" + req.params.name);
});
app.post("/Post",(req, res) => {
    // const { id, name } = req.body 
    res.send(req.body);
});


app.post("/api/user/signIn",(req,res)=>userController.signin(req,res));
app.post("/api/foodType/create",(req,res)=> FoodTypeController.create(req, res));
app.get("/api/foodType/list",(req, res)=> FoodTypeController.list(req,res));
app.delete("/api/foodType/remove/:id",(req,res) => FoodTypeController.remove(req,res));
app.put("/api/foodType/update", (req,res)=>FoodTypeController.update(req,res));
app.post("/api/foodSize/create",(req,res)=>FoodSizeController.create(req,res));
app.get("/api/foodSize/list", (req,res) => FoodSizeController.list(req,res));
app.delete("/api/foodSize/remove/:id",(req,res)=>FoodSizeController.remove(req,res));
app.put("/api/foodSize/update",(req,res)=>FoodSizeController.update(req,res));
app.post("/api/taste/create",(req,res)=>tasteController.create(req,res));
app.get("/api/taste/list",(req,res) => tasteController.list(req,res));
app.delete("/api/taste/remove/:id",(req,res)=>tasteController.remove(req,res));
app.put("/api/taste/update",(req,res)=>tasteController.update(req,res));
app.post("/api/food/create",(req,res)=> FoodController.create(req,res));
app.post("/api/food/upload", (req,res) => FoodController.upload(req,res));
app.get("/api/food/list",(req,res) => FoodController.list(req,res));
app.delete("/api/food/remove/:id", (req,res)=> 
    FoodController.remove(req, res)
);
app.put('/api/food/update',(req,res)=> FoodController.update(req,res));
app.get('/api/food/filter/:foodType',(req,res) => FoodController.filter(req,res));
app.post("/api/saleTemp/create",(req,res)=>saleTempController.create(req,res));
app.get("/api/saleTemp/list",(req,res) => saleTempController.list(req,res));
app.delete("/api/saleTemp/clear/:userId",(req,res) => saleTempController.clear(req,res));
app.delete("/api/saleTemp/remove/:foodId/:userId",(req,res)=>saleTempController.remove(req,res));
app.put("/api/saleTemp/changeQty", (req,res)=> saleTempController.changeQty(req,res));
app.get("/api/foodSize/filter/:foodTypeId",(req,res) => FoodSizeController.filter(req,res));
app.post("/api/saleTemp/createDetail",(req,res) => saleTempController.createDeatil(req,res));
app.get("/api/saleTemp/listSaleTempDetail/:saleTempId",(req,res)=>saleTempController.listSaleTempDetail(req,res));
app.post("/api/saleTemp/updateFoodSize",(req,res)=>saleTempController.updateFoodSize(req,res));



app.listen(3001);


//npx prisma studio 
// http://localhost:5555
//sopon khamyan P'jo

//solution 1 ************************

// http://localhost:5555/




