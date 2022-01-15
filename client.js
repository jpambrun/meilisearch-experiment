import React, { useState } from 'react';
import { render, Box, Text, Newline } from 'ink';
import TextInput from 'ink-text-input';

import Table from 'ink-table'


const SearchQuery = () => {
    const [query, setQuery] = useState('');

    return (
        <>
            <Box>
                <Box marginRight={1}>
                    <Text>Enter your query:</Text>
                </Box>

                <TextInput value={query} onChange={setQuery} />
            </Box>
            <Newline />
            <Table data={[{ name: 'a' }, { name: query }]} />
        </>
    );
};

render(<SearchQuery />);
