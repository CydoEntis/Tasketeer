const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
	{
		comment: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		createdBy: {
			username: {
				type: String,
				required: true,
			},
			userId: {
				type: Schema.Types.ObjectId,
				required: true,
				ref: 'User'
			}
		},
    taskId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Task'
    }
	},
);

module.exports = mongoose.model('Comment', commentSchema);
