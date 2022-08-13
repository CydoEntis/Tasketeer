const ObjectId = require('mongodb').ObjectId;

const io = require('../../socket');
const Comment = require("../../models/comment/comment.model");
const Task = require("../../models/task/task.model");

async function postComment(req, res, next) {
	try {
		const comment = new Comment({
			comment: req.body.comment,
			createdBy: {
				username: req.user.username,
				userId: req.user
			},
			taskId: req.body.id
		});
	
		const task = await Task.findById(req.body.id);
		task.commentCount += 1;
	
		await task.save();
	
		await comment.save();

		io.getIO().emit('comments', {
			action: 'create',
			comment: comment,
			task: task,
		});

		res.redirect('/task/' + req.body.id);
	} catch(e) {
		console.log(e)
	}

}

async function postDeleteComment(req, res, next) {
	const commentId = req.body.commentId;
	const taskId = req.body.taskId;

	try {
		const comment = await Comment.deleteOne({ _id: commentId })
		const task = await Task.findById(taskId)

		if(task.commentCount === 0) {
			task.commentCount = 0;
		} else {
			task.commentCount -= 1;
		}

		await task.save();

		console.log(comment);
		console.log(task);

		io.getIO().emit('comments', {
			action: 'delete',
			comment: comment,
			task: task,
		});

		res.redirect('/task/' + taskId);
	} catch(err) {
		console.error(err)
	}
}


module.exports = {
	postComment,
	postDeleteComment
}