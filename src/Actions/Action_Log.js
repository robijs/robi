/* Actions */
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'
import Action_Store from './Action_Store.js'

/** Settings */
import { App } from '../Core/Settings.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export default async function Action_Log(param) {
    const {
        Title,
        Message,
        StackTrace,
        Module
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get new request digest */
        const requestDigest = await Action_GetRequestDigest();

        /** @todo Check if Log exists, create if not */

        /**
         * SharePoint Ceate List REST API
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `../../_api/web/lists/GetByTitle('Log')/items`,
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('title').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Action_Store.user().Role
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                Module,
                __metadata: {
                    'type': `SP.Data.LogListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        const newItem = await Action_Post(postOptions);

        console.log(`%c'${Action_Store.user().Title}' logged in.`, 'background: #1e1e1e; color: #fff');

        return newItem.d;
    } else if (App.get('mode') === 'dev') {
        const options = {
            method: `POST`,
            body: JSON.stringify({
                Title,
                SessionId: sessionStorage.getItem(`${App.get('title').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Action_Store.user().Role
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                UserAgent: navigator.userAgent,
                Author: {
                    Title: App.get('dev').Name
                },
                Created: new Date().toISOString(),
                Module
            }),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        await fetch('http://localhost:3000/Log', options);

        console.log(`%c '${Action_Store.user().Title}' logged in. Session ID: ${sessionStorage.getItem(`${App.get('title').split(' ').join('_')}-sessionId`)}. `, 'background: #1e1e1e; color: #fff');
    }
}