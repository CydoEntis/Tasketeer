function formatDate(date) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const currDate = new Date(date);
	let month = months[currDate.getMonth()];
	let year = currDate.getFullYear();
	let day = currDate.getDate();
	return `${month} ${day}, ${year}`;
}

function getCompletedTasks(tasks) {
	let completedTasks = 0;
	for (let task of tasks) {
		if (task._doc.completed) {
			completedTasks += 1;
		}
	}
	return completedTasks;
}

const shorten = (text) => {
	let shortenedText = text.substring(0, 50);
	if (text.length >= 50) {
		shortenedText += '...';
	}
	return shortenedText;
};

module.exports = {
	formatDate,
	getCompletedTasks,
	shorten
};
