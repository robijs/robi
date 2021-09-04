/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_Comments from '../Components/Component_Comments.js'

export default async function View_Comments(param) {
    const {
        parentId,
        parent,
        position,
        width
    } = param;

    /** Comments */
    const comments = await Action_Get({
        list: 'Comments',
        filter: `FK_ParentId eq ${parentId}`,
        sort: 'Id desc'
    });

    const commentsComponent = Component_Comments({
        comments,
        width,
        parent,
        position,
        parentId
    });

    commentsComponent.add();

    /** Start polling */
    let start = new Date();
    let end = new Date();

    // setInterval(startPoll, 2000);

    async function startPoll() {
        console.log('Start:\t', start.toLocaleTimeString());
        console.log('End:\t',end.toLocaleTimeString());

        const newComments = await Action_Get({
            list: 'Comments',
            filter: `Account ne '${App.user.Account}' and FK_ParentId eq ${parentId} and Created ge datetime'${start.toISOString()}' and Created lt datetime'${end.toISOString()}'`
        });

        console.log(newComments);

        newComments.forEach(comment => {
            commentsComponent.addComment(comment);
        });

        start = end;
        end = new Date();
    }
}
