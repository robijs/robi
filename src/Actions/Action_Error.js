/* Actions */
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'

import Setting_App from '../Settings/Setting_App.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export default async function Action_Error(param) {
    const {
        Message,
        Error,
        Source,
        Line,
        ColumnNumber
    } = param;

    if (Setting_App.get('mode') === 'prod') { 
        /** Get new request digest */
    
        /** 
         * @author Wil Pacheco & John Westhuis
         * Added temporary alert to prevent infinite error loop when reporting error, & reload page for user.
         * 
         * @author Stephen Matheis
         * @to Wilfredo Pacheo, John Westhuis
         * Catching the request digest promise was a great idea. Jealous I didn't think of it >_<;
         */
        const requestDigest = await Action_GetRequestDigest().catch(e => {
            alert('Your session has expired, your page will now reload.')
            location.reload()
        });

        /** @todo check if Errors list exits, create if not */
        /**
         * Pass this object to fetch
         * 
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `../../_api/web/lists/GetByTitle('Errors')/items`,
            data: {
                SessionId: sessionStorage.getItem(`${Setting_App.get('title').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
                UserAgent: navigator.userAgent,
                Line,
                ColumnNumber,
                __metadata: {
                    'type': `SP.Data.ErrorsListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        const newItem = await Action_Post(postOptions);

        console.log(`%c Logged error '${Message}'. `, 'background: crimson; color: #fff');

        return newItem.d;
    } else if (Setting_App.get('mode') === 'dev') {
        const options = {
            method: `POST`,
            body: JSON.stringify({
                SessionId: sessionStorage.getItem(`${Setting_App.get('title').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
                Line,
                ColumnNumber,
                Author: {
                    Title: Setting_App.get('dev').Name
                },
                Created: new Date().toISOString()
            }),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        await fetch('http://localhost:3000/Errors', options);

        console.log(`%c Logged error '${Message}'. `, 'background: crimson; color: #fff');
    }
}