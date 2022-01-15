import React, { useState, useEffect } from 'react';
import { render, Box, Text, Newline } from 'ink';
import TextInput from 'ink-text-input';
import Table from 'ink-table'
const bent = require('bent')
const doSearch = bent('http://127.0.0.1:7700/indexes/studies/', 'POST', 'json', 200);

String.prototype.splice = function (index, count, add) {
    var chars = this.split('');
    chars.splice(index, count, add);
    return chars.join('');
}


const SearchQuery = () => {
    const [query, setQuery] = useState('paul');
    const [data, setData] = useState([]);
    useEffect(() => {
        doSearch('search', { q: query, matches: true }).then((data) => {
            data?.hits?.forEach(h => {
                if (h._matchesInfo) {
                    for (const [key, value] of Object.entries(h._matchesInfo)) {
                        h[key] = h[key].splice(value[0].start, 0, '\x1b[1m')
                        h[key] = h[key].splice(value[0].start + value[0].length + '\x1b[0m'.length, 0, '\x1b[0m')
                    }
                    delete h._matchesInfo
                }
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
                    <Text>({data?.processingTimeMs || ''}ms {data?.exhaustiveNbHits === false ? '~' : ''}{data?.exhaustiveNbHits !== undefined ? data.nbHits : '0'})</Text>
                </Box>
            </Box>
            <Newline />
            <Table data={data?.hits ? data?.hits?.slice(0, 5) : []} />
        </>
    );
};

render(<SearchQuery />);