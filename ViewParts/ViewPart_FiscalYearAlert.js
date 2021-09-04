/** Components */
import Component_Alert from '../Components/Component_Alert.js'

export default async function ViewPart_FiscalYearAlert(param) {
    const {
        parent,
        thisYear,
        startYear,
        fiscalYear
    } = param;

    /** @todo remove comparison to hard coded year */
    if (thisYear === startYear) {
        return;
    }

    const alertParam = {
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    };

    if (startYear < thisYear) {
        alertParam.type = 'warning';
        alertParam.text = /*html*/ `
            Changes can no longer be made to Market and Facility Plans for past Fiscal Year <strong>${fiscalYear}</strong>.
        `;  
    } else if (startYear > thisYear && startYear <= thisYear + 2) {
        alertParam.type ='info';
        alertParam.text = /*html*/ `
            Future Fiscal Year <strong>${fiscalYear}</strong> is within the current 3 year planning cycle.
        `;
    } else if (startYear - thisYear > 2)  {
        alertParam.type = 'danger';
        alertParam.text = /*html*/ `
            Fiscal Year <strong>${fiscalYear}</strong> is not within the current 3 year planning cycle.
        `;
    }

    const alertMessage = Component_Alert(alertParam);

    alertMessage.add();
}
