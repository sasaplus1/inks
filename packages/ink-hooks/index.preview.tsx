#!/usr/bin/env node --no-warnings --import tsx

import * as React from 'react';
import { render, useApp, useInput, Box, Text } from 'ink';

import { useFullscreen, useResize } from './index';

function App() {
  useFullscreen();

  const { columns, rows } = useResize();

  const { exit } = useApp();

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  return (
    <Box width={columns} height={rows} flexDirection="column">
      <Text bold>press q to exit</Text>
      <Text>
        {columns} x {rows}
      </Text>
    </Box>
  );
}

render(<App />);
