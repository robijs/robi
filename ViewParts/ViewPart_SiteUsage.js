/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_DashboardBanner from '../Components/Component_DashboardBanner.js'
import Component_DashboardLongCard from '../Components/Component_DashboardLongCard.js'

/** Models*/
import Model_SiteUsage from '../Models/Model_SiteUsage.js'
import Model_StartAndEndOfWeek from '../Models/Model_StartAndEndOfWeek.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'
import Action_SendEmail from '../Actions/Action_SendEmail.js'

export default async function View_SiteUsage(param) {
    const {
        parent
    } = param;

    /** Dashboard */
    const dashboardCard = Component_Card({
        title: 'Site Usage',
        titleColor: Setting_App.primaryColor,
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    dashboardCard.add();

    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading Site Usage Information',
        margin: '40px 0px',
        parent: dashboardCard
    });
    
    loadingIndicator.add();

    /** Worker */
    const worker = new Worker('Workers/Worker_SiteUsage.js', {
        type: 'module'
    });

    Action_Store.addWorker(worker);

    worker.onmessage = event => {
        const {
            data
        } = event;

        console.log(data);

        /** Stats 1 */
        const stats_1 = Component_DashboardBanner({
            data: data.stats_1,
            padding: '0px',
            border: 'none',
            margin: '20px 0px',
            parent: dashboardCard
        });

        stats_1.add();

        /** Bar Chart */
        const longCard = Component_DashboardLongCard({
            data: data.model,
            parent: dashboardCard,
            border: 'none',
            margin: '0px',
            onClick(label) {
                console.log('label:', label);
                console.log('current selected chart:', selectedChart);

                if (label !== selectedChart) {
                    selectedChart = label;
                    selectedData = data.model.chart[label];

                    console.log('new selected chart:', selectedChart)
                    console.log('new selected data:', selectedData)

                    longCard.clearChart();

                    const chart = addChart({
                        card: longCard,
                        type: selectedChart,
                        data: selectedData
                    });
                } else {
                    console.log('*** already selected ***');
                }
            }
        });

        longCard.add();

        /** Start with type: 'week' on load */
        let selectedChart = 'week';
        let selectedData = data.model.chart[selectedChart];

        addChart({
            card: longCard,
            type: selectedChart,
            data: selectedData
        });
        
        /** Stats 2 */
        const stats_2 = Component_DashboardBanner({
            data: data.stats_2,
            padding: '0px',
            border: 'none',
            margin: '20px 0px',
            parent: dashboardCard
        });

        stats_2.add();

        /** Remove Loading Indicator */
        loadingIndicator.remove();
    };

    /** Add Chart */
    function addChart(param) {
        const {
            card, 
            type, 
            data
        } = param;

        const chart = card.getChart();
        const max0 = Math.max(...data[0].data.map(set => set.length)); /** Largest number from Breaches */
        const max1 = 0;
        // const max1 = Math.max(...data[1].data.map(set => set.length)); /** Largest number from Complaints */
        const max = (Math.ceil((max0 + max1) / 10) || 1 ) * 10; /** Round sum of max numbers to the nearest multiple of 10 */
        // const max = (Math.round((max0 + max1) / 10) || 1 ) * 10; /** Round sum of max numbers to the nearest multiple of 10*/
        // const max = (Math.ceil((Math.max(...data.map(item => Math.max(...item.data)))) / 10) || 1 ) * 10;

        console.log(max, data)

        let stepSize;
        let labels;
        let text;

        if (max < 50) {
            stepSize = 1;
        } else {
            stepSize = 10;
        }

        switch(type) {
            case 'week':
                const options = { 
                    month: 'short',
                    day: 'numeric'
                };    
                const startAndEndOfWeek = Model_StartAndEndOfWeek();
                const monday = startAndEndOfWeek.monday.toLocaleString('default', options);

                startAndEndOfWeek.sunday.setDate(startAndEndOfWeek.sunday.getDate() - 2);
                const friday = startAndEndOfWeek.sunday.toLocaleString('default', options);
                
                labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                text = `${monday} - ${friday}`
                break;
            case 'month':
                labels = data[0].data.map((item, index) => index + 1);
                text = new Date().toLocaleString('default', { month: 'long' });
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

        return new Chart(chart, {
            type: 'bar',
            data: {
                labels,
                datasets: data.map((set, index) => {
                    /** [0] set is purple, [1] set is blue */
                    return {
                        data: set.data.map(item => item.length),
                        label: set.label,
                        backgroundColor: index === 0 ? `rgb(${Setting_App.primaryColorRGB}, 0.2)` : 'rgb(67, 203, 255, 0.2)',
                        borderColor: index === 0 ? `rgb(${Setting_App.primaryColorRGB}, 1)` : 'rgb(67, 203, 255, 1)',
                        // backgroundColor: index === 0 ? 'rgb(147, 112, 219, 0.2)' : 'rgb(67, 203, 255, 0.2)',
                        // borderColor: index === 0 ? 'rgb(147, 112, 219, 1)' : 'rgb(67, 203, 255, 1)',
                        borderWidth: 1
                    }
                })
            },
            options: {
                scales: {
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            /** Set to max value in dataset */
                            // max,
                            min: 0,
                            stepSize
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}
