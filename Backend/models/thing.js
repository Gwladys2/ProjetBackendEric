const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
});

const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false }, // Rendre description optionnelle si elle n'est pas incluse
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: false }, // Rendre le prix optionnel si nécessaire
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: { type: [ratingSchema], required: true },
    averageRating: { type: Number, required: true }
});

module.exports = mongoose.model('Thing', thingSchema);
