const express=require('express');
const Thing = require("../models/thing");
const router=express.Router();
const  booksCtrl=require('../controlleurs/books')


router.get('/',booksCtrl.getAllStuff )
router.get('/:id', booksCtrl.getOneThing);
router.put('/:id', booksCtrl.modifyThing);
router.delete('/:id', booksCtrl.deleteThing)

router.post('/', booksCtrl.createThing);


module.exports=router;
