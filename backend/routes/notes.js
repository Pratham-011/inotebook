const express = require('express');
const router = express.Router();
const Note= require('../models/Note');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//Route 1: get all the notes using get:"api/auth/getuser". Login requiired
router.get('/fetchallnotes', fetchuser,async(req,res)=>{
    try {
        const notes = await Note.find({user: req.user.id}) ;
    res.json(notes)   
    } catch (error){
        console.log(error.message);
        res.status(500).send("internal serevr error");
    }
    
    
})

//Route 2: add a new note using post:"api/auth/addnote". Login requiired
router.post('/addnote', fetchuser,
[  
body('title', 'Enter a valid title').isLength({min: 3}),
body('description', 'description must be atleast 5 char').isLength({min: 5}),
], async(req,res)=>{
    try {
         //if there are error return bad request and the error
    const {title,description,tag}=req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note({
        title,description,tag,user:req.user.id
    })
    const savedNote = await note.save()
    res.json(note)   
        
    } catch (error){
        console.log(error.message);
        res.status(500).send("internal serevr error");
    }
    

   
    
})
// route 3: update and existig note : put: "api/auth/updatenote" logn required
router.post('/updatenote/:id', fetchuser, async(req,res)=>{
    const {title,description,tag} = req.body;
    try {
        
    //create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    // find the note to be updated and update it 
    let note  = await Note.findById(req.params.id);
    if(!note){res.status(404).send("Not found")}
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
    res.json({note});
} 
    catch (error){
        console.log(error.message);
        res.status(500).send("internal serevr error");
    }
}) 


// route 4: delete and existig note : delete: "api/auth/deletenote" logn required
router.delete('/deletenote/:id', fetchuser, async(req,res)=>{
    try {
        
     // find the note to be delete and delete it 
    let note  = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

    //allow deletion pnly if user owns thsi note
    if(note.user.toString()!== req.user.id){
        return res.status(401).send("not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success0":"Note has been deleted ",note: note});
}
    catch (error){
        console.log(error.message);
        res.status(500).send("internal serevr error");
    }
}) 
module.exports = router