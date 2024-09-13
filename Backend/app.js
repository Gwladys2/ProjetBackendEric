const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Thing = require('./models/thing');

// Connexion à MongoDB
mongoose.connect('mongodb+srv://NomUtilisateur:password@cluster0.c7ljozc.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !', error));

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Route GET pour récupérer les livres de la base de données

app.get('/api/books', (req, res, next)=>{
    Thing.find()
        .then(things=>res.status(200).json(things))
        .catch(error=>res.status(400).json({error}));
});

app.get('/api/books/:id', (req,res)=>{
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
});

app.put('/api/books/:id', (req,res, next)=>{
    Thing.updateOne({_id:req.params.id},{...req.body, _id:req.params.id})
        .then(()=>res.status(200).json({message:'Objet modifié avec succes!'}))
        .catch(error=>res.status(400).json({error}));
});

app.delete('/api/books/:id', (req, res, next)=>{
    Thing.deleteOne({_id:req.params.id})
        .then(()=>res.status(200).json({message: 'Objet supprimé avec succes!!'}))
        .catch(error=>res.status(400).json({error}));
})


// Route POST pour ajouter un livre
app.post('/api/books', async (req, res) => {
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
});

module.exports = app;
