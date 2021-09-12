/** Settings */
import { App } from '../Core/Settings.js'

/* Global Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_Container(param) {
    const {
        align,
        background,
        border,
        borderBottom,
        borderLeft,
        borderRight,
        borderTop,
        display,
        flex,
        flexwrap,
        shadow,
        direction,
        height,
        justify,
        margin,
        padding,
        parent,
        position,
        radius,
        width,
        maxWidth,
        minWidth,
        overflow,
        overflowX,
        overflowY,
        userSelect,
        layoutPosition,
        top,
        bottom,
        left,
        right,
        zIndex
    } = param;

    return Action_Component({
        html: /*html*/ `
            <div class='container'></div>
        `,
        style: /*css*/ `
            #id {
                user-select: ${userSelect || 'initial'};
                -webkit-user-select: ${userSelect || 'initial'};
                -moz-user-select: ${userSelect || 'initial'};
                -ms-user-select: ${userSelect || 'initial'};
                background: ${background || 'none'};
                flex-wrap: ${flexwrap || 'unset'};
                flex-direction: ${direction || 'row'};
                justify-content: ${justify || 'flex-start'};
                align-items: ${align || 'flex-start'};
                height: ${height || 'unset'};
                width: ${width || 'unset'};
                max-width: ${maxWidth || 'unset'};
                min-width: ${minWidth || 'unset'};
                margin: ${margin || '0'};
                padding: ${padding || '0'};
                border-radius: ${radius || 'unset'};
                border-top: ${borderTop || 'none'};
                border-right: ${borderRight || 'none'};
                border-bottom: ${borderBottom || 'none'};
                border-left: ${borderLeft || 'none'};
                border: ${border || 'initial'};
                box-shadow: ${shadow || 'none'};
                flex: ${flex || 'unset'};
                display: ${display || 'flex'};
                /** @todo is this the best method? */
                ${
                    overflow ?
                    `overflow: ${overflow}` :
                    ''
                }
                ${
                    overflowX ?
                    `overflow-x: ${overflowX}` :
                    ''
                }
                ${
                    overflowY ?
                    `overflow-y: ${overflowY}` :
                    ''
                }
                ${
                    zIndex ? 
                    `z-index: ${zIndex};` :
                    ''
                }
                ${
                    layoutPosition ? 
                    `position: ${layoutPosition};` :
                    ''
                }
                ${
                    top ? 
                    `top: ${top};` :
                    ''
                }
                ${
                    bottom ? 
                    `bottom: ${bottom};` :
                    ''
                }
                ${
                    left ? 
                    `left: ${left};` :
                    ''
                }
                ${
                    right ? 
                    `right: ${right};` :
                    ''
                }
            }
        `,
        parent,
        position,
        events: [
            
        ]
    });
}