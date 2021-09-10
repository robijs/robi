/** Actions */
import Start from './Start.js'

Start({
    routes: [
        {
            path: 'Test',
            icon: 'book',
            go() {
                console.log('it works!');
            }  
        },
    ],
    settings: {

    }
});
