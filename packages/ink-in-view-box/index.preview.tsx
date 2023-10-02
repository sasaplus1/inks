#!/usr/bin/env node --no-warnings --loader tsx

import * as React from 'react';
import { render, useApp, useInput, Box, Text } from 'ink';

import { InViewBox } from './index';

const children: React.ReactNode[] = [];

for (let i = 0; i < 100; i++) {
  children.push(<Text key={i}>{i}</Text>);
}

function App() {
  const { exit } = useApp();

  const [cursor, setCursor] = React.useState(-2);
  const [height, setHeight] = React.useState(10);

  useInput((input, key) => {
    if (input === 'q') {
      exit();
    }

    switch (input) {
      case '1':
        setCursor(10);
        break;
      case '2':
        setCursor(20);
        break;
      case '3':
        setCursor(30);
        break;
      case '4':
        setCursor(40);
        break;
      case '5':
        setCursor(50);
        break;
      case '6':
        setCursor(60);
        break;
      case '7':
        setCursor(70);
        break;
      case '8':
        setCursor(80);
        break;
      case '9':
        setCursor(90);
        break;
    }

    if (input === 'g') {
      setCursor(0);
    }
    if (input === 'G') {
      setCursor(children.length - 1);
    }

    if (input === 'h') {
      setHeight(10);
    }
    if (input === 'l') {
      setHeight(30);
    }

    if (key.upArrow || input === 'k') {
      if (cursor <= 0) {
        return;
      }

      setCursor((cursor) => cursor - 1);
    }

    if (key.downArrow || input === 'j') {
      if (cursor >= children.length - 1) {
        return;
      }

      setCursor((cursor) => cursor + 1);
    }
  });

  return (
    <React.Fragment>
      <Text bold>press q to exit | press up/down(or k/j) to change cursor</Text>
      <Text bold>
        press 1-9 to change cursor | press g/G to change cursor to start/end |
        press h/l to change height
      </Text>
      <Text bold>cursor: {cursor}</Text>
      <Box borderStyle="single" flexDirection="row">
        <InViewBox
          cursor={cursor}
          height={height}
          initialOffset={0}
          initialHeight={height}
          flexGrow={1}
        >
          {children.map((child, index) =>
            cursor === index ? (
              <Text key={'cursor:' + index} inverse>
                {child}
              </Text>
            ) : (
              child
            )
          )}
        </InViewBox>
      </Box>
    </React.Fragment>
  );
}

render(<App />);
