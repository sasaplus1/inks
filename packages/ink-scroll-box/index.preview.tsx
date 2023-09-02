#!/usr/bin/env node --no-warnings --loader tsx

import * as React from 'react';
import { render, useApp, useInput, Box, Text } from 'ink';

import { ScrollBox } from './index';

const children: React.ReactNode[] = [];

for (let i = 1; i <= 100; i++) {
  children.push(<Text key={i}>{i}</Text>);
}

function App() {
  const { exit } = useApp();

  const [offset, setOffset] = React.useState(10);

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }

    if (key.upArrow || input === 'k') {
      if (offset <= 0) {
        return;
      }

      setOffset((offset) => offset - 1);
    }

    if (key.downArrow || input === 'j') {
      if (offset >= children.length - 1) {
        return;
      }

      setOffset((offset) => offset + 1);
    }
  });

  return (
    <React.Fragment>
      <Text bold>
        press q to exit | press up/down(or k/j) to change offset | offset:{' '}
        {offset}
      </Text>
      <Box borderStyle="single" flexDirection="row">
        <ScrollBox offset={offset} height={10} flexGrow={1}>
          {children}
        </ScrollBox>
        <ScrollBox
          offset={offset}
          height={10}
          flexGrow={1}
          borderStyle="single"
        >
          {children}
        </ScrollBox>
      </Box>
    </React.Fragment>
  );
}

render(<App />);
