const fs = require('fs')

// fs.readFile('../src/lists.js', 'utf8' , (err, data) => {
//     if (err) {
//         console.error(err)
//         return
//     }

//     console.log(data);
// });

// return;

const db = {
    "Comments": [],
    "Errors": [],
    "Log": [],
    "Users": [],
    "Questions": [],
    "ReleaseNotes": [],
        "Roles": [
        {
            "Id": 1,
            "Title": "Administrator"
        },
        {
            "Id": 2,
            "Title": "Developer"
        },
        {
            "Id": 3,
            "Title": "User"
        }
    ],
    "Settings": [
        {
            "Id": 1,
            "Key": "QuestionTypes",
            "Value": "[{\"title\":\"General\",\"path\":\"General\"},{\"title\":\"Access\",\"path\":\"RDS\"},{\"title\":\"Feedback\",\"path\":\"KSA\"}]"
        }
    ]
}

fs.writeFile('./json-server/db.json', JSON.stringify(db), err => {
    if (err) {
        console.error(err)
        return
    }
})