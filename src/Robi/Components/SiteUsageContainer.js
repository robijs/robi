import { Card } from './Card.js' 
import { DashboardBanner } from './DashboardBanner.js' 
import { ChartJs } from './ChartJs.js' 
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { Container } from './Container.js'
import { Wait } from '../Robi.js'

// NOTE: Add page ranking table below chart
// @START-File
/**
 *
 * @param {*} param
 */
export async function SiteUsageContainer({ parent }) {
    // Card container
    const chartCard = Card({
        classes: ['shimmer'],
        width: '100%',
        padding: '0px',
        parent
    });

    chartCard.add();

    // Top banner
    const topBanner = DashboardBanner({
        data: [
            {
                label: 'Total Page Views',
                hide: true
            },
            {
                label: 'Unique Page Views',
                hide: true
            },
            {
                label: 'Unique Users', // NOTE: Same as Active users, making it redundant
                hide: true
            },
            {
                label: 'Unique Roles',
                hide: true
            }
        ],
        parent: chartCard
    });

    topBanner.add();

    // Middle container
    const middleContainer = Container({
        background: 'var(--background)',
        radius: '10px',
        radius: '10px',
        // minHeight: '300px',
        margin: '10px 0px',
        parent: chartCard
    });

    middleContainer.add();

    // Chart container
    const chartContainer = Container({
        radius: '10px',
        width: '100%',
        parent: middleContainer
    });

    chartContainer.add();

    // Chart
    const chart = ChartJs({
        parent: chartContainer,
        margin: '10px 0px',
        padding: '0px'
    });

    chart.add();

    // Button Container
    const buttonContainer = Container({
        parent: middleContainer
    });

    buttonContainer.add();

    // Bottom banner
    const bottomBanner = DashboardBanner({
        data: [
            {
                label: 'Most Popular Page',
                hide: true
            },
            {
                label: 'Most Active Role',
                hide: true
            },
            {
                label: 'Most Active Visitor',
                hide: true
            },
            {
                label: 'Last used',
                hide: true
            }
        ],
        parent: chartCard
    });

    bottomBanner.add();

    if (App.get('mode') === 'dev') {
        await Wait(2000);
    }

    // EACH BUTTON PRESS WILL RUN CODE BELOW HERE
    // TODO: set selectedChart and selectedData on button press like before

    // Set worker path based on env mode
    const workerPath = App.get('mode') === 'prod' ? '../' : `http://127.0.0.1:8080/src/`;

    // Initialize worker
    const worker = new Worker(`${workerPath}Robi/Workers/SiteUsage.js`, {
        type: 'module'
    });

    // Send data to worker
    worker.postMessage({
        envMode: App.get('mode'),
        site: App.get('site'),
        date: new Date(),
        type: 'today'
    });

    // Store worker so it can be terminated if user routes away
    Store.addWorker(worker);

    // Receive output from worker
    worker.onmessage = event => {
        const { data } = event;
        const { topBannerData, bottomBannerData, chartData } = data;

        topBanner.update(topBannerData);
        bottomBanner.update(bottomBannerData);

        addChart({
            card: chart,
            type: 'today',
            data: chartData
        });

        // Remove shimmmer
        chartCard.removeClass('shimmer');
    };

    // TODO: This should live in Chart component
    // Add chart
    function addChart(param) {
        const { card, type, data } = param;

        const chart = card.getChart();
        const max0 = Math.max(...data[0].data.map(set => set.length)); // Largest number from dataset
        const max1 = 0;
        const max = (Math.ceil((max0 + max1) / 10) || 1) * 10; // Round sum of max numbers to the nearest multiple of 10 

        let stepSize;
        let labels;
        let text;

        if (max < 50) {
            stepSize = 1;
        } else {
            stepSize = 10;
        }

        switch (type) {
            case 'today':
                labels = [
                    '00:00',
                    '01:00',
                    '02:00',
                    '03:00',
                    '04:00',
                    '05:00',
                    '06:00',
                    '07:00',
                    '08:00',
                    '09:00',
                    '10:00',
                    '11:00',
                    '12:00',
                    '13:00',
                    '14:00',
                    '15:00',
                    '16:00',
                    '17:00',
                    '18:00',
                    '19:00',
                    '20:00',
                    '21:00',
                    '22:00',
                    '23:00'
                ];
                text = new Date().toLocaleDateString('default', {
                    dateStyle: 'full'
                });
                break;
            case 'week':
                const options = {
                    month: 'long',
                    day: 'numeric'
                };
                const startAndEndOfWeek = StartAndEndOfWeek();
                const sunday = startAndEndOfWeek.sunday.toLocaleString('default', options);
                const saturday = startAndEndOfWeek.saturday.toLocaleString('default', options);

                labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                text = `${sunday} - ${saturday}, ${startAndEndOfWeek.sunday.getFullYear()}`;
                break;
            case 'month':
                labels = data[0].data.map((item, index) => index + 1);
                text = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                break;
            case 'year':
                labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                text = new Date().getFullYear();
                break;
            default:
                console.log('missing type');
                break;
        }

        card.setTitle(text);

        console.log({
            labels,
            datasets: data.map((set, index) => {
                return {
                    data: set.data.map(item => item.length),
                    label: set.label,
                    backgroundColor: App.get('primaryColor'),
                    hoverBackgroundColor: App.get('primaryColor'),
                    borderWidth: 0,
                    borderRadius: 4
                };
            })
        });

        return new Chart(chart, {
            type: 'bar',
            data: {
                labels,
                datasets: data.map((set, index) => {
                    return {
                        data: set.data.map(item => item.length),
                        label: set.label,
                        backgroundColor: App.get('primaryColor'),
                        hoverBackgroundColor: App.get('primaryColor'),
                        borderWidth: 0,
                        borderRadius: 4
                    };
                })
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            borderColor: App.get('primaryColor'),
                            display: false
                        },
                        stacked: true,
                        ticks: {
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                            },
                            color: App.get('defaultColor'),
                            beginAtZero: true
                        }
                    },
                    y: {
                        grid: {
                            borderColor: App.get('primaryColor'),
                            display: false
                        },
                        stacked: true,
                        ticks: {
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
                            },
                            color: App.get('defaultColor'),
                            min: 0,
                            stepSize
                        }
                    }
                }
            }
        });
    }
}
// @END-File
