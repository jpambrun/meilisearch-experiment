import React, { useState, useEffect } from 'react';
import { render, Box, Text, Newline } from 'ink';
import TextInput from 'ink-text-input';
import Table from 'ink-table'
const bent = require('bent')
const doSearch = bent('http://localhost:8108/collections/studies/documents/', 'GET', 'json', [200, 201, 409], {"X-TYPESENSE-API-KEY": "Hu52dwsas2AdxdE" });


String.prototype.splice = function (index, count, add) {
    var chars = this.split('');
    chars.splice(index, count, add);
    return chars.join('');
}


const SearchQuery = () => {
    const [query, setQuery] = useState('paul');
    const [data, setData] = useState([]);
    useEffect(() => {
        doSearch(`search?q=${query.replace(' ', '%20')}&query_by=studyDescription,name&filter_by=modality:xa&sort_by=date:desc`).then((data) => {
            if (!data?.hits) return;
            data.hits = data.hits.map(hit => {
                const {document, highlights} = hit;
                document.dob = (new Date(document.dob)).toISOString().split('T')[0]
                document.date = (new Date(document.date)).toISOString().split('T')[0]
                highlights.forEach(highlight => {
                    document[highlight.field] = highlight.snippet.replaceAll('<mark>','▒').replaceAll('</mark>','▒')
                });
                return document;
            });
            setData(data)
        })
    }, [query])
    return (
        <>
            <Box>
                <Box marginRight={1}>
                    <Text>Enter your query:</Text>
                </Box>

                <TextInput value={query} onChange={setQuery} />
                <Box marginRight={10}>
                    <Text>({data?.search_time_ms || ''}ms {data?.found ?? '0'})</Text>
                </Box>
            </Box>
            <Newline />
            <Table
                // cell={CustomCell}
                data={data?.hits ? data?.hits?.slice(0, 5) : []}
            />
        </>
    );
};

render(<SearchQuery />);
