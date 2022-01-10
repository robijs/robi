// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Table, Row, Alert } from '../../Robi/RobiUI.js'

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