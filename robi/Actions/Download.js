/**
 * 
 * @param {*} param 
 */
// TODO: Chacnge
export function Download(param) {
    const {
        fileName,
        csv
    } = param;

    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');

    // File name
    const today = new Date();
    downloadLink.download = `${`${fileName || App.get('name')}_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`}.csv`;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none';

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}