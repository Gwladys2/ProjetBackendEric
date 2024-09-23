const express = require('express');
const mongoose = require('mongoose');
const userRoutes=require('../Backend/routes/user')
const app = express();
const booksRoutes=require('../Backend/routes/books');
const path=require('path');

// Connexion à MongoDB
mongoose.connect('mongodb+srv://IdentifiantIci:VotreMotDePass@cluster0.c7ljozc.mongodb.net/test?retryWrites=true&w=majority', {
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

app.use('/api/books', booksRoutes);
app.use('/api/auth',userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app
