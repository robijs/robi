import { Table, Row } from '../../Robi/RobiUI.js'

export default async function SortTables({ parent }) {
    // @START-Rows
    Row(async (parent) => {
        await Table({
            list: 'MLOT',
            parent,
            advancedSearch: true,
            toolbar: [
                {
                    label: 'All',
                    filter(data) {
                        return data;
                    }
                }
            ]
        });
    });
    // @Row
    Row(async (parent) => {
        await Table({
            list: 'Choice',
            parent,
            advancedSearch: true,
            toolbar: [
                {
                    label: 'All',
                    filter(data) {
                        return data;
                    }
                }
            ]
        });
    });
    // @Row
    Row(async (parent) => {
        await Table({
            list: 'Number',
            parent,
            advancedSearch: true,
            toolbar: [
                {
                    label: 'All',
                    filter(data) {
                        return data;
                    }
                }
            ]
        });
    });
    // @Row
    Row(async (parent) => {
        await Table({
            list: 'SLOT',
            parent,
            advancedSearch: true,
            toolbar: [
                {
                    label: 'All',
                    filter(data) {
                        return data;
                    }
                }
            ]
        });
    });
    // @END-Rows
}