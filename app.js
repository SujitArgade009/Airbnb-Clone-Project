if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const { log } = require("console");
const listings=require("./routes/listing.js");
const Reviews=require("./routes/review.js");
const user=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const MongoStore = require('connect-mongo');

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

let port=8000;

// let MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASDB_URL;


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET, 
    },
    touchAfter: 24 *3600,
});

store.on("error",()=>{
    console.log("ERROR IN MOGODB ATLAS SESSION STORE" ,err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET, 
    resave:false, 
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


main().then((res)=>{
    console.log("Connection Succesfully Created");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
};


// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(dbUrl, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });
//   async function run() {
//     try {
//       // Connect the client to the server	(optional starting in v4.7)
//       await client.connect(dbUrl);
//       // Send a ping to confirm a successful connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);

//-----------------------------------------------------------------------
// app.get("/",(req,res)=>{
//     res.redirect("/listings");
// });

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("Success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

// app.get("/demouser", async (req,res)=>{
//     let fakeUser=new User({
//         email:"Sujitargade243@gmail.com",
//         username:"Sujitargade009",
//     });

//     let registeredUser= await User.register(fakeUser, "Sujit@123");
//     res.send(registeredUser);
// });

app.use("/listings", listings);
app.use("/listings/:id/review",Reviews);
app.use("/",user);

app.all("*",(req, res, next) =>{
    next(new ExpressError(404,"Page Not found!"));
});

app.use((err, req, res, next)=>{
    let{statusCode=500,message="Something Went Wrong"}= err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(port,()=>{
    console.log("Listinig to the port 8000");
});