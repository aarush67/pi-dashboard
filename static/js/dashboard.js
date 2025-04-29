console.log('Dashboard.js loaded');

// Initialize chart
const ctx = document.getElementById('metricsChart').getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            {
                label: 'CPU Usage (%)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: [],
                fill: false
            },
            {
                label: 'Memory Usage (%)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: [],
                fill: false
            },
            {
                label: 'Temperature (°C)',
                borderColor: 'rgba(255, 206, 86, 1)',
                data: [],
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        }
    }
});

console.log('Chart initialized');

// Initialize with historical data
historicalData.forEach(data => {
    chart.data.datasets[0].data.push({ x: new Date(data.timestamp), y: data.cpu });
    chart.data.datasets[1].data.push({ x: new Date(data.timestamp), y: data.mem });
    chart.data.datasets[2].data.push({ x: new Date(data.timestamp), y: data.temp });
});
chart.update();
console.log('Historical data loaded:', historicalData);

// Poll for real-time updates
function updateMetrics() {
    fetch('/metrics')
        .then(response => response.json())
        .then(data => {
            console.log('Received metrics:', data);
            document.getElementById('cpu').textContent = `${data.cpu.toFixed(1)}%`;
            document.getElementById('mem').textContent = `${data.mem.toFixed(1)}%`;
            document.getElementById('temp').textContent = `${data.temp.toFixed(1)}°C`;

            const now = new Date();
            chart.data.datasets[0].data.push({ x: now, y: data.cpu });
            chart.data.datasets[1].data.push({ x: now, y: data.mem });
            chart.data.datasets[2].data.push({ x: now, y: data.temp });

            if (chart.data.datasets[0].data.length > 100) {
                chart.data.datasets.forEach(dataset => dataset.data.shift());
            }

            chart.update();
        })
        .catch(error => console.error('Error fetching metrics:', error));
}

setInterval(updateMetrics, 5000); // Poll every 5 seconds
