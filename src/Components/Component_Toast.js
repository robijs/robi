/** Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_Toast(param) {
    const {
        title,
        body,
        parent,
        position,
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='position-fixed bottom-0 right-0 p-3' style='z-index: 5; right: 0; bottom: 0;'>
                <div class='toast' role='alert' aria-live='assertive' aria-atomic='true'>
                    <div class='toast-header'>
                        <!-- <img src='...' class='rounded mr-2' alt='...'> -->
                        <strong class='mr-auto'>${title}</strong>
                        <!-- <small class='text-muted'>11 mins ago</small> -->
                        <button type='button' class='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'>
                            <span aria-hidden='true'>&times;</span>
                        </button>
                    </div>
                    <div class='toast-body'>
                        ${body}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `

        `,
        parent,
        position,
        events: [
            
        ],
        onAdd() {
            /** Inizialize and show*/
            $(component.get()).toast('show')
        }
    });

    return component;
}