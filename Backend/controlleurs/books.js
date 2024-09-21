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

exports.createThing = async (req, res) => {
    try {

        const thingObject = JSON.parse(req.body.book);

        thingObject.userId = req.auth.userId;
        thingObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

        const thing = new Thing(thingObject);

        console.log('Data to be saved:', thing);
        await thing.save();
        console.log('Data saved successfully');
        res.status(201).json({ message: 'Objet enregistré!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.getBestRatedBooks = async (req, res) => {
    try {
        const bestRatedBooks = await Thing.find().sort({ averageRating: -1 }).limit(3); // Tri par averageRating décroissant
        res.status(200).json(bestRatedBooks);
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.addRating = async (req, res) => {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    // Vérification de la note (entre 0 et 5)
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }

    try {
        // Récupération du livre
        const book = await Thing.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        const existingRating = book.ratings.find(r => r.userId === userId);

        if (existingRating) {
            return res.status(400).json({ message: 'Cet utilisateur a déjà noté ce livre.' });
        }

        // Ajouter la nouvelle note
        book.ratings.push({ userId, rating });

        // Recalcul de la moyenne des notes
        const totalRatings = book.ratings.length;
        const sumRatings = book.ratings.reduce((sum, r) => sum + r.rating, 0);
        book.averageRating = sumRatings / totalRatings;

        // Sauvegarde des modifications
        await book.save();

        // Renvoyer le livre mis à jour
        res.status(200).json(book);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde :', error.errors);
        res.status(500).json({ error: error.message });
    }
};

