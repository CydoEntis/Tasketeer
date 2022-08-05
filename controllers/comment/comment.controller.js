const ObjectId = require('mongodb').ObjectId;

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
	
		res.redirect('/task/' + req.body.id);
	} catch(e) {
		console.log(e)
	}

}

function postDeleteComment(req, res, next) {
	const commentId = req.body.commentId;
	const taskId = req.body.taskId;

	Comment.deleteOne({ _id: commentId })
		.then(() => {
			res.redirect('/task/' + taskId);
		})
		.catch((err) => console.error(err));
}


module.exports = {
	postComment,
	postDeleteComment
}