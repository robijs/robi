/** Actions */
import { Get } from '../Actions.js'

/** Models*/
import { SiteUsage } from '../Models.js'

(async () => {
    onmessage = async event => {
        const items = await Get({
            list: 'Log',
            select: 'Id,Title,SessionId,Created,Message,Module,StackTrace,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
            expand: `Author/Id,Editor/Id`,
            orderby: 'Id desc',
            path: '../../..',
            mode: event.data
        });

        const visitors = [...new Set(items.map(item => item.Author.Title))];

        const pages = [...new Set(items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.location) {
                    return message.location.split('#')[1];
                }
            } catch (error) {
                // console.log(error);
            }
        }))].filter(item => item !== undefined);
    
        const allPages = items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.location) {
                    return message.location.split('#')[1];
                }
            } catch (error) {
                // console.log(error);
            }
        }).filter(item => item !== undefined);
    
        const roles = [...new Set(items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.role) {
                    return message.role;
                }
            } catch (error) {
                // console.log(error);
            }
        }))].filter(item => item !== undefined);
    
        const allRoles = items.map(item => {
            try {
                const message = JSON.parse(item.Message);
    
                if (message.role) {
                    return message.role;
                }
            } catch (error) {
                // console.log(error);
            }
        }).filter(item => item !== undefined);
    
        const mostPopularPage = mode(allPages);
        const mostPopularRole = mode(allRoles);
    
        /** {@link https://stackoverflow.com/a/20762713} */
        function mode(arr){
            return arr.sort((a,b) =>
                    arr.filter(v => v===a).length
                - arr.filter(v => v===b).length
            ).pop();
        }
    
        /** Model Site Usage */
        const model = SiteUsage({
            visits: items
        });
    
        postMessage({
            stats_1: [
                {
                    label: 'Total Page Views',
                    value: items.length,
                },
                {
                    label: 'Unique Page Views',
                    value: pages.length,
                },
                {
                    label: 'Unique Visitors',
                    value: visitors.length,
                },
                {
                    label: 'Unique Roles',
                    value: roles.length,
                },
                {
                    label: 'Monthly Active Users',
                    value: visitors.length,
                }
            ],
            stats_2: [
                // {
                //     label: 'Average Visit Length',
                //     value: '00:00:00',
                //     description: 'HH:MM:SS'
                // },
                {
                    label: 'Most Popular Page',
                    value: mostPopularPage,
                },
                {
                    label: 'Most Active Role',
                    value: mostPopularRole,
                },
                {
                    label: 'Most Active Visitor',
                    value: visitors[0],
                    description: 'Developer',
                },
                {
                    label: 'Last Visit',
                    // value: new Date(items[0].Created).toLocaleDateString() + ' ' + new Date(items[0].Created).toLocaleTimeString(),
                    value: new Date(items[0].Created).toLocaleDateString('default', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }),
                    description: items[0].Author.Title
                }
            ],
            model
        });
    }
})();
