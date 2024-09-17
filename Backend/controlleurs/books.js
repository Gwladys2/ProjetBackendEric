const Thing=require('../models/thing');


exports.getAllStuff=(req, res, next)=>{
    Thing.find()
        .then(things=>res.status(200).json(things))
        .catch(error=>res.status(400).json({error}));
}

exports.getOneThing=(req,res)=>{
    const bookId=req.params.id;

    Thing.findById(bookId)
        .then(thing=>{
            if (thing){
                res.status(200).json(thing);
            }else {
                res.status(404).json({message:'Livre non trouvé'});
            }
        })
        .catch(error=>res.status(400).json({error}));
}

exports.modifyThing=(req,res, next)=>{
    Thing.updateOne({_id:req.params.id},{...req.body, _id:req.params.id})
        .then(()=>res.status(200).json({message:'Objet modifié avec succes!'}))
        .catch(error=>res.status(400).json({error}));
}

exports.deleteThing=(req, res, next)=>{
    Thing.deleteOne({_id:req.params.id})
        .then(()=>res.status(200).json({message: 'Objet supprimé avec succes!!'}))
        .catch(error=>res.status(400).json({error}));
}

exports.createThing=async (req, res) => {
    delete req.body._id; // Supprimer _id si présent
    const thing = new Thing({ ...req.body });

    try {
        console.log('Data to be saved:', thing);
        await thing.save();
        console.log('Data saved successfully');
        res.status(201).json({ message: 'Objet enregistré!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(400).json({ error });
    }
}
