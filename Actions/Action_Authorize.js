/** Actions */
import Action_Store from './Action_Store.js'
import Action_Route from './Action_Route.js'

/** Settings */
import Setting_Routes from '../Settings/Setting_Routes.js'

/**
 * Determines if role (defaults to current user's role from Action_store.user().Role)
 * is authorized to access passed in view as string or objection property param.view
 * @param {(String|Object)} param most likely a View name as a string
 * @param {string} param.view if param is a object, view is a required property
 * @param {string} param.role if param is a object, role is an optional propety
 * @returns {(undefied|false|true)}
 */
export default function Action_Authorize(param) {
    let role, view;

    if (typeof param === 'string') {
        role = Action_Store.user().Role;
        view = param;
    } else if (typeof param === 'object') {
        role = param.role || Action_Store.user().Role;
        view = param.view;
    }

    /** Find route */
    const route = Setting_Routes.find(item => item.path === view);

    /** If route not found, return undefined */
    if (!route) {
        return;
    }

    const {
        roles
    } = route;

    /** If roles property not defined on route object, return undefined */
    if (roles) {
        if (roles.includes(role)) {
            /** Authorized if role is included in roles array */
            console.log(`Role ${role} authorized to access View ${view}.`)
            return true;
        } else {
            /** Unauthroized if role is not included in roles array */
            if (param.route !== false) {
                /** If param.route isn't set to false, route to View 403 */
                Action_Route('403');
            }
            
            return false;
        }
    } else {
        return undefined;
    }
}