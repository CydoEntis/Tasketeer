const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		priority: {
			type: String,
		},
		description: {
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
		assignedTo: {
			username: {
				type: String,
			},
			userId: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		},
		imageIds: [
			{
				type: Schema.Types.ObjectId, 
				ref:'Image'
			}
		],
		status: {
			type: String,
		},
		commentCount: {
			type: Number,
			default: 0,
		},
		dueDate: {
			type: Date,
		},
	},
	// {
	// 	timestamps: true,
	// }
);

module.exports = mongoose.model('Task', taskSchema);
