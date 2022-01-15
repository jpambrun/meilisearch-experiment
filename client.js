import React, { useState, useEffect } from 'react';
import { render, Box, Text, Newline } from 'ink';
import TextInput from 'ink-text-input';
import Table from 'ink-table'
const bent = require('bent')
const doSearch = bent('http://127.0.0.1:7700/indexes/studies/search', 'GET', 'json', 200);


const SearchQuery = () => {
    const [query, setQuery] = useState('?matches=true&q=paul');
    const [data, setData] = useState([]);
    useEffect(() => {
        doSearch(query).then((data) => {
            data?.hits?.forEach(h => {
                h.name = 'YO!!'+  '\u001b[31m' + h.name + '\u001b[39m';
            });
            setData(data)
            // console.log(data.hits[0]._matchesInfo);process.exit(0)
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
            <Table data={data?.hits ? data?.hits?.slice(0, 5).map(h => {
                const ret = {...h}
                delete ret._matchesInfo
                return ret
            }) : []} />
        </>
    );
};

render(<SearchQuery />);
