const lineChart = document.getElementById('lineChart');
const pieChart = document.getElementById('pieChart');

const today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
const year = today.getFullYear();

const lastDayPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);

const pastDays = [];

for (let i = 5; i >= 0; i--) {
	if (day <= 1) {
		day = lastDayPrevMonth.getDate();
		month -= 1;
	}
	currDay = day - i;
	pastDays.push(month + '/' + currDay + '/' + year);
}
pastDays.push(month + 1 + '/' + today.getDate() + '/' + year);

// for(let i = 7; i >= 0; i--) {
//     let currDay;
//   if(day === 1) {
//     currDay = lastDayPrevMonth;
//     currDay -= 1;
//   }  else {
//     currDay = day - i;
//   }
//   pastDays.push(month + "/" + currDay + "/" + year);
// }

const getWeeklyTasks = async () => {
	let res = await fetch('/weeklyTasks');
	let data = await res.json();

	const weeklyTasks = Object.keys(data).map((val) => data[val]);

	return weeklyTasks;
};

const createPieChart = async () => {
    let res = await fetch('/getAllTasks');
	let data = await res.json();


	const newPieChart = new Chart(pieChart, {
		type: 'pie',
		data: {
			labels: ['Red', 'Blue', 'Yellow'],
			datasets: [
				{
					label: 'My First Dataset',
					data: [300, 50, 100],
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(54, 162, 235)',
						'rgb(255, 205, 86)',
					],
					hoverOffset: 4,
				},
			],
		},
	});
};

const createLineChart = async () => {
	const weeklyTasks = await getWeeklyTasks();

	const newLineChart = new Chart(lineChart, {
		type: 'line',
		data: {
			labels: pastDays,
			datasets: [
				{
					label: '# of Complete Tickets',
					data: weeklyTasks,
					backgroundColor: '#643FDB',
					borderColor: '#643FDB',
					borderWidth: 3,
				},
			],
		},
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	});
};

// createPieChart();
createLineChart();
