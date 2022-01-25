// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Get } from '../../Robi/Robi.js'
import { Alert, BootstrapButton } from '../../Robi/RobiUI.js'

// @START-Button
export default async function Button({ parent }) {
    console.clear();

    // alert('Hello, world!');

    const btn = BootstrapButton({
        value: 'Compare',
        type: 'robi',
        parent,
        async action() {
            alert('compare');
            const items = await Get({
                list: 'AllTypes'
            });
        
            // console.log(items);
        
            const newList = [
                {
                    "SLOT": "Test",
                    "MLOT": "Test",
                    "Number": 1,
                    "Choice": "Two",
                    "MultiChoice": {
                        "results": [
                            "One"
                        ]
                    },
                    "AuthorId": 1,
                    "Author": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "EditorId": 1,
                    "Editor": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "Created": "Sun, 16 Jan 2022 06:11:11 GMT",
                    "Modified": "Sun, 16 Jan 2022 06:11:11 GMT",
                    "Id": 1
                },
                {
                    "SLOT": "Test",
                    "MLOT": "Test",
                    "Number": 1,
                    "Choice": "Two",
                    "MultiChoice": {
                        "results": [
                            "One"
                        ]
                    },
                    "AuthorId": 1,
                    "Author": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "EditorId": 1,
                    "Editor": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "Created": "Sun, 16 Jan 2022 06:58:33 GMT",
                    "Modified": "Sun, 16 Jan 2022 06:58:33 GMT",
                    "Id": 2
                },
                {
                    "SLOT": "Test",
                    "MLOT": "Test",
                    "Number": 1,
                    "Choice": "Two",
                    "MultiChoice": {
                        "results": [
                            "One"
                        ]
                    },
                    "AuthorId": 1,
                    "Author": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "EditorId": 1,
                    "Editor": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "Created": "Sun, 16 Jan 2022 07:06:11 GMT",
                    "Modified": "Sun, 16 Jan 2022 07:06:11 GMT",
                    "Id": 3
                },
                {
                    "SLOT": "Test",
                    "MLOT": "Test",
                    "Number": 1,
                    "Choice": "Two",
                    "MultiChoice": {
                        "results": [
                            "Two"
                        ]
                    },
                    "AuthorId": 1,
                    "Author": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "EditorId": 1,
                    "Editor": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "Created": "Sun, 16 Jan 2022 08:31:42 GMT",
                    "Modified": "Sun, 16 Jan 2022 08:32:19 GMT",
                    "Id": 4
                },
                {
                    "SLOT": "Changed",
                    "MLOT": "Test",
                    "Number": 1,
                    "Choice": "Two",
                    "MultiChoice": {
                        "results": [
                            "One"
                        ]
                    },
                    "AuthorId": 1,
                    "Author": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "EditorId": 1,
                    "Editor": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "Created": "Tue, 18 Jan 2022 15:45:09 GMT",
                    "Modified": "Tue, 18 Jan 2022 15:45:09 GMT",
                    "Id": 5
                },
                {
                    "SLOT": "New",
                    "MLOT": "Test",
                    "Number": 1,
                    "Choice": "Two",
                    "MultiChoice": {
                        "results": [
                            "One"
                        ]
                    },
                    "AuthorId": 1,
                    "Author": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "EditorId": 1,
                    "Editor": {
                        "Title": "First Last",
                        "LoginName": "0987654321@mil"
                    },
                    "Created": "Tue, 18 Jan 2022 15:45:09 GMT",
                    "Modified": "Tue, 18 Jan 2022 15:45:09 GMT",
                    "Id": 6
                }
            ];
        
            // console.log(newList);
        
            newList.forEach((item, index) => {
                // console.log(item);
        
                const { SLOT } = item;
                const oldValue = items[index]?.SLOT;
                
                console.log('Items:', oldValue);
                console.log('New List:', SLOT);
        
                if (oldValue !== SLOT) {
                    console.log('DIFFERENT!');

                    const msg = Alert({
                        text: `#${item.Id} - Different`,
                        parent
                    });

                    msg.add();
                }
            });
        }
    });

    btn.add();
}
// @END-Button
