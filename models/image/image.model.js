const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = mongoose.Schema({
  name: String,
  path: String,
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }
})

module.exports = mongoose.model('Image', imageSchema);