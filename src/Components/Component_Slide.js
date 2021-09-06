/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** Actions*/
import Component from '../Actions/Action_Component.js'
import Action_Get from '../Actions/Action_Get.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_CreateFile from '../Actions/Action_CreateFile.js'
import Action_CopyItem from '../Actions/Action_CopyItem.js'

/** Components */
import Component_Notification from '../Components/Component_Notification.js'

export default function Component_Slide(param) {
    const {
        library,
        slide,
        onCheck,
        parent
    } = param;

    const {
        Id,
        Title,
        Published,
        Modified,
        Editor,
        Author,
        Final
    } = slide;

    const component = Component({
        html: /*html*/ `
            <div class='slide-container ${Final === 'Yes' ? 'final' : ''}'>
                <div class='slide-label'>${Title}</div>
                <div class='slide-cell-container'>
                    ${displayCheckbox()}
                    <div class='slide-cell left-cell'>
                        <a href='ms-powerpoint:ofv|u|https://rhcc.amedd.army.mil/mtf/DHCC/cmdandstaffslides/${library}/${Title}.pptx'>
                            <img src='https://rhcc.amedd.army.mil/mtf/DHCC/cmdandstaffslides/${library}/_t/${Title}_pptx.jpg'>
                        </a>
                    </div>
                    <div class='slide-cell right-cell'>
                        <div class='slide-toolbar'>
                            <div class='publish slide-button'>Publish new slide</div>
                            <input style='display: none;' type='file' accept='application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'/>
                            <!-- <div class='archive slide-button red'>Archive this slide</div> -->
                            ${!onCheck ? '' : Final === 'Yes' ? markNoTemplate() : markYesTemplate()}
                        </div>
                        <table>
                            ${displayPublished()}
                            <tr>
                                <th>Last modified</th>
                                <td class='modified-date'>${new Date(Modified).toLocaleDateString()} ${new Date(Modified).toLocaleTimeString()}</td>
                                <td class='modified-by'>${Editor.Title}</td>
                            </tr>
                        </table>
                        <div><strong></strong> </div>
                        <div><strong></strong>  </div>
                    </div>
                </div>
                <div class='checkmark'>
                    <svg class="icon">
                        <use href="#icon-checkmark"></use>
                    </svg>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.slide-container {
                padding: 10px;
                margin-top: 10px;
                margin-bottom: 30px;
                position: relative;
                border: solid 2px transparent;
            }

            #id .slide-label {
                font-size: 1.1em;
                font-weight: bold;
                margin-bottom: 5px;
            }

            #id .slide-cell-container {
                margin: 20px 0px;
                display: flex;
                align-items: center;
            }

            #id.slide-container img {
                cursor: pointer;
                position: relative;
                object-fit: scale-down;
                border: solid 2px ${Setting_App.primaryColor};
                border-radius: 8px;
                box-shadow: 7px 7px 0px 0px ${Setting_App.primaryColor};
            }

            #id.slide-container img:hover {
                filter: brightness(0.8);
            }

            #id.slide-container .slide-cell {
                margin-right: 10px;
            }

            #id.slide-container .slide-cell table th,
            #id.slide-container .slide-cell table td {
                text-align: left;
                padding: 5px 10px;
            }

            /* Updated */
            #id.slide-container .updated {
                margin-left: 10px;
                padding: 2px 4px;
                background: mediumseagreen;
                color: white;
                border-radius: 4px;
            }

            /* Buttons */
            #id .slide-toolbar {
                display: inline-flex;
                flex-direction: column;
                margin-bottom: 10px;
            }

            #id .slide-button {
                width: 214px;
                white-space: nowrap;
                user-select: none;
                cursor: pointer;
                text-align: center;
                font-weight: 500;
                padding: 5px 10px;
                background: white;
                margin: 5px 15px;
                border-radius: 4px;
                border: solid 2px ${Setting_App.primaryColor};
            }
            
            #id .slide-button.green {
                background: mediumseagreen;
                border: solid 2px darkgreen;
                color: white;
            }

            #id .slide-button.red {
                color: white;
                background: indianred;
                border: solid 2px darkred;
            }

            /* Checkboxes */
            label {
                display: flex;
            }

            input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                /* border: solid 2px seagreen; */
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }
            

            input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }

            /* Final */
            #id.final {
                background: aquamarine;
                border-radius: 4px;
                border: solid 2px mediumseagreen;
            }

            #id .slide-button.not-final {
                background: transparent;
                border: solid 2px transparent;
                text-decoration: underline;
            }
            
            /* Checkmark */
            #id .checkmark {
                opacity: ${Final === 'Yes' ? 'opacity: 1' : '0'};
                position: absolute;
                top: 10px;
                right: 10px; 
                font-size: 1.5em;
            }

            #id .checkmark .icon {
                fill: darkgreen;
                stroke: darkgreen;
            }
        `,
        parent,
        position: 'beforeend',
        events: [
            {
                selector: `#id input[type='checkbox']`,
                event: 'click',
                listener: onCheck
            },
            {
                selector: `#id img`,
                event: 'click',
                listener(event) {
                    const poll = setInterval( async () => {
                        const clientVersion = parseInt(slide.__metadata.etag.replace('"', ''));

                        const getItem = await Action_Get({
                            list: library,
                            select: 'Id,Editor/Title,Author/Title,Title,Presentation,SlideDescription,Published,Modified,Final',
                            expand: 'Editor,Author',
                            filter: `Id eq ${slide.Id}`
                        });

                        const item = getItem[0];

                        const serverVersion = parseInt(item.__metadata.etag.replace('"', ''));

                        if (serverVersion > clientVersion) {
                            /** Replace item */
                            const index = Setting_App.data.lists[library].indexOf(slide);
                            Setting_App.data.lists[library].splice(index, 1, item);

                            /** Update Thumbnail */
                            const thumbnail = component.find('img');
                            thumbnail.src = `https://rhcc.amedd.army.mil/mtf/DHCC/cmdandstaffslides/${library}/_t/${Title}_pptx.jpg?${new Date().getTime()}`;

                            /** Update Last Modified */
                            const modified = component.find('.modified-date');
                            modified.innerText = `${new Date(item.Modified).toLocaleDateString()} ${new Date(item.Modified).toLocaleTimeString()}`;

                            /** Update Last Modified By */
                            const modifiedBy = component.find('.modified-by');
                            modifiedBy.innerHTML = `${item.Editor.Title}<span class='updated'>Updated<span>`;

                            clearInterval(poll);
                        }
                    }, 1000);
                }
            },
            {
                selector: `#id .mark-yes`,
                event: 'click',
                listener: markYesAction
            },
            {
                selector: `#id .mark-no`,
                event: 'click',
                listener: markNoAction
            },
            {
                selector: `#id .publish`,
                event: 'click',
                async listener(event) {
                    console.log('publish');

                    const fileInput = component.find(`input[type='file']`);

                    fileInput.click();
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;

                    if (files.length > 0) {
                        Action_Store.get('maincontainer').dim(true);

                        const notification = Component_Notification({
                            text: `Publishing new <em>${Title}</em> slide...`,
                            hold: true,
                            type: 'information'
                        });
                    
                        notification.add();

                        if (onCheck) {
                            /** Update archived date for current slide */
                            await Action_UpdateItem({
                                list: 'Slides',
                                itemId: Id,
                                data: {
                                    Archived: new Date().toISOString()
                                },
                                notify: false
                            });

                            /** Copy to archive list */
                            await Action_CopyItem({
                                from: 'Slides',
                                to: 'ArchivedSlides',
                                file: `${Title}.pptx`,
                                newName: `${Title} - ${Id}.pptx`,
                                notify: false
                            });
                        }

                        /** Publish new file with same name */
                        const file = files[0];

                        const newFile = await Action_CreateFile({
                            file,
                            name: Title,
                            select: `Id,Editor/Title,Author/Title,Title,Presentation,SlideDescription,Modified${onCheck ? ',Published,Final' : ''}`,
                            expand: 'Editor,Author',
                            list: library,
                            notify: false,
                        });

                        let updatedFile;

                        if (onCheck) {
                            /** Update published date for current slide */
                            updatedFile = await Action_UpdateItem({
                                list: 'Slides',
                                itemId: Id,
                                data: {
                                    Published: new Date().toISOString()
                                },
                                notify: false
                            });
                        }

                        /** Update Thumbnail */
                        const thumbnail = component.find('img');
                        thumbnail.src = `https://rhcc.amedd.army.mil/mtf/DHCC/cmdandstaffslides/${library}/_t/${Title}_pptx.jpg?${new Date().getTime()}`;


                        if (onCheck) {
                            /** Update Published */
                            const published = component.find('.published-date');
                            published.innerText = `${new Date(updatedFile.Published).toLocaleDateString()} ${new Date(updatedFile.Published).toLocaleTimeString()}`;
                        }
                        
                        /** Update Last Modified */
                        const modified = component.find('.modified-date');
                        modified.innerText = `${new Date(newFile.Modified).toLocaleDateString()} ${new Date(newFile.Modified).toLocaleTimeString()}`;

                        /** Update Last Modified By */
                        const modifiedBy = component.find('.modified-by');
                        modifiedBy.innerHTML = `${newFile.Editor.Title}<span class='updated'>Updated<span>`;

                        notification.slideOut();
                        Action_Store.get('maincontainer').dim(false);
                    }
                }
            },
            // {
            //     selector: `#id .archive`,
            //     event: 'click',
            //     async listener(event) {
            //         console.log('archive');
            //     }
            // }
        ]
    });

    function displayCheckbox() {
        let html = '';

        if (onCheck) {
            html = /*html*/ `
                <div class='slide-cell left-cell'>
                    <label>
                        <input type="checkbox" />
                        <span class="toggle"></span>
                    </label>
                </div>
            `;
        } else {
            html = '';
        }

        return html;
    }

    function displayPublished() {
        let html = '';

        if (onCheck) {
            html = /*html*/ `
                <tr>
                    <th>Published</th>
                    <td class='published-date'>${new Date(Published).toLocaleDateString()} ${new Date(Published).toLocaleTimeString()}</td>
                    <td class='published-by'>${Author.Title}</td>
                </tr>
            `;
        } else {
            html = '';
        }

        return html;
    }

    function markNoTemplate() {
        return /*html*/ `
            <div class='mark-no slide-button not-final'>Mark this slide as <em>not</em> final</div>
        `
    }

    function markYesTemplate() {
        return /*html*/ `
            <div class='mark-yes slide-button green'>Mark this slide as final</div>
        `
    }

    async function markNoAction(event) {
        component.get().classList.remove('final');
        component.find('.checkmark').style.opacity = '0';

        const markNo = component.find('.mark-no');

        if (markNo) {
            markNo.insertAdjacentHTML('afterend', markYesTemplate());
            markNo.remove();
        }

        component.find('.mark-yes').addEventListener('click', markYesAction);

        await Action_UpdateItem({
            list: 'Slides',
            itemId: Id,
            data: {
                Final: 'No'
            },
            notify: false
        });
    }

    async function markYesAction(event) {
        component.get().classList.add('final');
        component.find('.checkmark').style.opacity = '1';

        const markYes = component.find('.mark-yes');

        if (markYes) {
            markYes.insertAdjacentHTML('afterend', markNoTemplate());
            markYes.remove();
        }

        component.find('.mark-no').addEventListener('click', markNoAction);

        return await Action_UpdateItem({
            list: 'Slides',
            itemId: Id,
            data: {
                Final: 'Yes'
            },
            notify: false
        });
    }

    component.toggle = () => {
        const checkbox = component.find(`input[type='checkbox']`);

        if (checkbox.checked) {
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        }
    }

    component.check = () => {
        const checkbox = component.find(`input[type='checkbox']`);

        if (!checkbox.checked) {
            checkbox.checked = true;
        }
    }

    component.unCheck = () => {
        const checkbox = component.find(`input[type='checkbox']`);

        if (checkbox.checked) {
            checkbox.checked = false;
        }
    }

    component.isChecked = () => {
        const checkbox = component.find(`input[type='checkbox']`);

        return checkbox.checked;
    }

    component.getSlideItem = () => {
        return slide;
    }

    component.markAsFinal = () => {
        markYesAction();
    }

    component.unMarkAsFinal = () => {
        markNoAction();
    }

    return component;
}