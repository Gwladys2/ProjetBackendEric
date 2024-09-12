const express = require('express');
const mongoose = require('mongoose');

const app = express();
const Thing = require('./models/thing');

// Connexion à MongoDB
mongoose.connect('mongodb+srv://NomUtilisateur:MotDepasseIci@cluster0.c7ljozc.mongodb.net/test?retryWrites=true&w=majority', {
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

// Route GET pour récupérer les livres
app.get('/api/books', (req, res) => {
    const stuff = [
        {
            "id": "1",
            "userId": "clc4wj5lh3gyi0ak4eq4n8syr",
            "title": "Milwaukee Mission",
            "author": "Elder Cooper",
            "year": 2021,
            "genre": "Policier",
            "averageRating": 5,
            "imageUrl": "https://via.placeholder.com/206x260"
        }
    ];
    res.status(200).json(stuff);
});

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
