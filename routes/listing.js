const express= require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const { authorize } = require("passport");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});


const listingController=require("../controllers/listings.js");

// Reformating the router routes For the same route::

router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListings)
);
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });

// New Route::
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListings)
);

//Index Route:: will get the all Listings here:
// router.get("/",wrapAsync(listingController.index));



// Show Route:;
// router.get("/:id", wrapAsync(listingController.showListings));

// Create Route:: Accessing the data form the POST request
// router.post(
//     "/",
//     isLoggedIn,
//     wrapAsync(listingController.createListings));

// Edit route::
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//Update Route::
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.updateListings));

// DELETE Route::

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListings));

module.exports= router;

// const str1="ca6cf11eadd8c3a876cbe938732074da76d936a7a9a584d7b0fbc2fca6f627b9";
// const str2="ca6cf11eadd8c3a876cbe938732074da76d936a7a9a584d7b0fbc2fca6f627b9";

// function checking(){
//     if(str1===str2){
//         console.log("Password matched You'r welcome");
//     }else{
//         console.log("Please Re-Enter Your Password");
//     }
// }
// checking();

