const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const NewsListSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    img_url: { type: String, required: true, trim: true, },
    ref_url: { type: String, required: true, trim: true, },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('newslist', NewsListSchema)
