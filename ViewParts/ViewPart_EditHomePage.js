/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_GetLib from '../Actions/Action_GetLib.js'
import Action_UploadFiles from '../Actions/Action_UploadFiles.js'

/** Components */
import Component_Container from '../Components/Component_Container.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'
import Component_Heading from '../Components/Component_Heading.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_BootstrapDropdown from '../Components/Component_BootstrapDropdown.js'
import Component_BootstrapButton from '../Components/Component_BootstrapButton.js'
import Component_UploadButton from '../Components/Component_UploadButton.js'

export default async function ViewPart_EditHomePage(param) {
    const {
        data,
        parent,
        modal
    } = param;
    
    const {
        header,
        lifecycle,
        model
    } = data;

    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading form',
        margin: '40px 0px',
        parent
    });
    
    loadingIndicator.add();

    /** Get images */
    const images = await Action_GetLib({
        path: '/sites/J5/QPP/App/src/Images/home',
        type: 'Files'
    });

    console.log(images);

    /** Header heading */
    const headerHeading = Component_Heading({
        text: 'Header',
        color: 'MediumSlateBlue',
        margin: '0px 40px 10px 40px',
        parent
    });
    
    headerHeading.add();

    /** Header */
    const headerField = Component_MultiLineTextField({
        label: '',
        description: '',
        value: header,
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent
    });
    
    headerField.add();

    /** Lifecycle heading */
    const lifecycleHeading = Component_Heading({
        text: 'LifeCycle',
        color: 'MediumSlateBlue',
        margin: '0px 40px 10px 40px',
        parent
    });
    
    lifecycleHeading.add();

    /** Lifecycle Label */
    const lifecycleLabelField = Component_SingleLineTextField({
        label: 'Label',
        description: '',
        value: lifecycle.label,
        width: '100%',
        fieldMargin: '10px 40px 20px 40px',
        parent
    });
    
    lifecycleLabelField.add();

    /** Lifecycle Image */
    const lifecycleImgParts = lifecycle.img.split('/');
    const lifecycleImgName = lifecycleImgParts[lifecycleImgParts.length - 1];

    const lifecycleImgDropdown = Component_BootstrapDropdown({
        action(event) {
            dropdownAction({
                component: lifecycleImgDropdown,
                activeImg: lifecycleImgName,
                element: this
            });
        },
        parent,
        label: /*html*/ `
            <div>Image</div>
            <div style='margin: 10px 0px;'>
                <img src='..${lifecycle.img}' style='height: 100px; border-radius: 4px;'>
            </div>
        `,
        margin: '0px 40px 20px 40px',
        items: images
        // .filter(image => image.Name !== lifecycleImgName)
        .map(image => {
            const {
                ServerRelativeUrl,
                Name
            } = image;

            const active = Name === lifecycleImgName ? /*html*/ `<span class="badge badge-info">Active</span>` : ''

            return {
                label: /*html*/ `
                    <div style='display: inline-block; width: 130px'>
                        <img src='${ServerRelativeUrl}' style='height: 64px;'>
                    </div>
                    <span>
                        <span class='img-name'>${Name}</span>
                        ${active}
                    </span>
                `,
                path: ServerRelativeUrl
            }
        }),
        value: lifecycleImgName
    });

    lifecycleImgDropdown.add();

    /** Add Lifecycle image */
    const addLifecycleImageButton = Component_UploadButton({
        async action(files) {
            console.log(files);

            const uploadedFiles = await Action_UploadFiles({
                files,
                path: 'App/src/Images/home'
            });

            console.log(uploadedFiles);
        },
        parent: lifecycleImgDropdown.find('.btn'),
        position: 'afterend',
        type: 'btn-outline-success',
        value: 'Add new image',
        margin: '0px 0px 0px 10px'
    });

    addLifecycleImageButton.add();

    /** Lifecycle Text */
    const lifecycleTextField = Component_MultiLineTextField({
        label: 'Text',
        description: '',
        value: lifecycle.text,
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent
    });
    
    lifecycleTextField.add();

    /** Model heading */
    const modelHeading = Component_Heading({
        text: 'Model',
        color: 'MediumSlateBlue',
        margin: '10px 40px 10px 40px',
        parent
    });
    
    modelHeading.add();

    /** Model Label */
    const modelLabelField = Component_SingleLineTextField({
        label: 'Label',
        description: '',
        value: model.label,
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent
    });
    
    modelLabelField.add();

    /** Model Image */
    const modelImgParts = model.img.split('/');
    const modelImgName = modelImgParts[modelImgParts.length - 1];

    const modelImgDropdown = Component_BootstrapDropdown({
        action(event) {
            dropdownAction({
                component: modelImgDropdown,
                activeImg: modelImgName,
                element: this
            });
        },
        parent,
        label: /*html*/ `
            <div>Image</div>
            <div style='margin: 10px 0px;'>
                <img src='..${model.img}' style='height: 100px; border-radius: 4px;'>
            </div>
        `,
        margin: '0px 40px 20px 40px',
        items: images
        // .filter(image => image.Name !== modelImgName)
        .map(image => {
            const {
                ServerRelativeUrl,
                Name
            } = image;

            const active = Name === modelImgName ? /*html*/ `<span class="ml-2 badge badge-info">Active</span>` : ''

            return {
                label: /*html*/ `
                    <div style='display: inline-block; width: 130px'>
                        <img src='${ServerRelativeUrl}' style='height: 64px;'>
                    </div>
                    <span>
                        <span class='img-name'>${Name}</span>
                        ${active}
                    </span>
                    
                `,
                path: ServerRelativeUrl
            }
        }),
        value: modelImgName
    });

    modelImgDropdown.add();

    /** Add Model image */
    const addModelImageButton = Component_UploadButton({
        action(files) {
            console.log(files);
        },
        parent: modelImgDropdown.find('.btn'),
        position: 'afterend',
        type: 'btn-outline-success',
        value: 'Add new image',
        margin: '0px 0px 0px 10px'
    });

    addModelImageButton.add();

    /** Model Text */
    const modelTextField = Component_MultiLineTextField({
        label: 'Text',
        description: '',
        value: model.text,
        width: '100%',
        fieldMargin: '0px 40px 20px 40px',
        parent
    });
    
    modelTextField.add();

    /** Remove Loading Indication */
    loadingIndicator.remove();

    /** Focus on name field */
    headerField.focus();

    function dropdownAction(param) {
        const {
            component,
            activeImg,
            element
        } = param;

        /** 1. Update image */
        component.find('img').src = element.dataset.path;

        /** 2 Update button */
        const imageName = element.querySelector('.img-name').innerText;

        component.find('.dropdown-toggle').innerText = imageName;

        /** 3. Update List */
        const newList = images
        // .filter(image => image.Name !== imageName)
        .map(image => {
            const {
                ServerRelativeUrl,
                Name
            } = image;

            const active = Name === activeImg ? /*html*/ `<span class="ml-2 badge badge-info">Active</span>` : ''
            const selected = Name === imageName ? /*html*/ `<span class="ml-2 badge badge-secondary">Selected</span>` : ''
            
            return {
                label: /*html*/ `
                    <div style='display: inline-block; width: 130px'>
                        <img src='${ServerRelativeUrl}' style='height: 64px;'>
                    </div>
                    <span>
                        <span class='img-name'>${Name}</span>
                        ${active}
                        ${selected}
                    </span>
                `,
                path: ServerRelativeUrl
            }
        });

        component.setDropdownMenu(newList);
    }

    return {
        getFieldValues() {
            const data = {
                header: headerField.value(),
                lifecycle: {
                    label: lifecycleLabelField.value(),
                    type: 'lifecycle',
                    img: `/src/Images/home/${lifecycleImgDropdown.value()}`,
                    text: lifecycleTextField.value()
                },
                model: {
                    label: modelLabelField.value(),
                    type: 'model',
                    img: `/src/Images/home/${modelImgDropdown.value()}`,
                    text: modelTextField.value()
                },
            }

            return data;
        }
    };
}
