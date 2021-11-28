import { Lists } from '../Models/Lists.js'
import lists from '../../lists.js'

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CheckLists(param) {
    // Check lists
    const listsToIgnore =  ['App', 'Composed Looks', 'Documents', 'Master Page Gallery', 'MicroFeed', 'Site Assets', 'Site Pages'];
    const coreLists = Lists();
    const appLists = lists;
    const allLists = coreLists.concat(appLists);
    const webLists = await GetWebLists();
    const installedLists = webLists.map(item => item.Title).filter(x => allLists.map(item => item.list).includes(x));
    const diffToCreate = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
    const diffToDelete = webLists.map(item => item.Title).filter(x => !allLists.map(item => item.list).includes(x) && !listsToIgnore.includes(x));
    
    console.log('All Lists:', allLists);
    console.log('Web Lists:', webLists);
    console.log('Installed Lists:', installedLists);
    console.log('Create:', diffToCreate);
    console.log('Delete:', diffToDelete);

    // News lists that need to be created
    const toCreate = diffToCreate.map(list => allLists.find(item => item.list === list));

    // Existing lists that need to be deleted
    const toDelete = diffToDelete.map(list => webLists.find(item => item.Title === list));

    // Has the schema changed on any lists?
    const fieldsToIgnore = ['ContentTypeId', 'Title', '_ModerationComments', 'File_x0020_Type', 'ID', 'Id', 'ContentType', 'Modified', 'Created', 'Author', 'Editor', '_HasCopyDestinations', '_CopySource', 'owshiddenversion', 'WorkflowVersion', '_UIVersion', '_UIVersionString', 'Attachments', '_ModerationStatus', 'Edit', 'LinkTitleNoMenu', 'LinkTitle', 'LinkTitle2', 'SelectTitle', 'InstanceID', 'Order', 'GUID', 'WorkflowInstanceID', 'FileRef', 'FileDirRef', 'Last_x0020_Modified', 'Created_x0020_Date', 'FSObjType', 'SortBehavior', 'PermMask', 'FileLeafRef', 'UniqueId', 'SyncClientId', 'ProgId', 'ScopeId', 'HTML_x0020_File_x0020_Type', '_EditMenuTableStart', '_EditMenuTableStart2', '_EditMenuTableEnd', 'LinkFilenameNoMenu', 'LinkFilename', 'LinkFilename2', 'DocIcon', 'ServerUrl', 'EncodedAbsUrl', 'BaseName', 'MetaInfo', '_Level', '_IsCurrentVersion', 'ItemChildCount', 'FolderChildCount', 'AppAuthor', 'AppEditor'];
    const schemaAdd = [];
    const schemaDelete = [];

    installedLists
    .map(listName => {
        const { list, fields } = allLists.find(item => item.list === listName);

        return { list, fields, web: webLists.find(item => item.Title === listName) };
    })
    .forEach(item => {
        const { list, fields, web } = item;

        const webFields = web.Fields.results.map(webField => {
            const { StaticName, TypeDisplayName } = webField;

            return { name: StaticName, type: TypeDisplayName }
        });

        const fieldsToCreate = fields.map(item => item.name).filter(x => !webFields.map(item => item.name).includes(x));
        const fieldsToDelete = webFields.map(item => item.name).filter(x => !fields.map(item => item.name).includes(x) && !fieldsToIgnore.includes(x));

        if (fieldsToCreate.length) {
            schemaAdd.push({
                list,
                fields: fieldsToCreate
            });
        }

        if (fieldsToDelete.length) {
            schemaDelete.push({
                list,
                fields: fieldsToDelete
            });
        }

        // console.log('List:', list);
        // console.log('--------------------');
        // console.log('List Fields:', fields);
        // console.log('Web Fields:', webFields);
        // console.log('Create fields:', fieldsToCreate);
        // console.log('Remove fields:', fieldsToDelete);
        // console.log(' ');
    });

    console.log('Fields to add:', schemaAdd);
    console.log('Fields to delete:', schemaDelete);

    return { toCreate, toDelete, schemaAdd, schemaDelete };
}
