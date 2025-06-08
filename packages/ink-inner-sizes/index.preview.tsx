#!/usr/bin/env node --no-warnings --import tsx

import type { BoxProps, DOMElement } from 'ink';

import * as React from 'react';
import { measureElement, render, useApp, useInput, Box, Text } from 'ink';

import { innerSizes } from './index';

function SizeBox(props: BoxProps) {
  const ref = React.useRef<DOMElement>(null);
  const [width, setWidth] = React.useState(props.width);
  const [height, setHeight] = React.useState(props.height);
  const [innerWidth, setInnerWidth] = React.useState(props.width);
  const [innerHeight, setInnerHeight] = React.useState(props.height);

  React.useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = measureElement(ref.current);

      setWidth(width);
      setHeight(height);

      const sizes = innerSizes({ width, height }, props);

      setInnerWidth(sizes.innerWidth);
      setInnerHeight(sizes.innerHeight);
    }
  }, []);

  return (
    <Box {...props} ref={ref}>
      <Text>
        {width} x {height} / {innerWidth} x {innerHeight}
      </Text>
    </Box>
  );
}

function App() {
  const { exit } = useApp();

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  return (
    <React.Fragment>
      <Text bold>press q to exit</Text>
      <Box flexDirection="column">
        <SizeBox width={20} height={4} borderStyle="single" />
        <SizeBox
          width={20}
          height={4}
          borderStyle="single"
          borderLeft
          borderRight={false}
        />
        <SizeBox
          width={20}
          height={4}
          borderStyle="single"
          borderLeft={false}
          borderRight
        />
        <SizeBox
          width={20}
          height={4}
          borderStyle="single"
          borderLeft
          borderRight
        />
        <SizeBox width={20} height={4} />
      </Box>
      <Box flexDirection="row">
        <SizeBox width={20} height={4} borderStyle="single" />
        <SizeBox
          width={20}
          height={4}
          borderStyle="single"
          borderTop
          borderBottom={false}
        />
        <SizeBox
          width={20}
          height={4}
          borderStyle="single"
          borderTop={false}
          borderBottom
        />
        <SizeBox
          width={20}
          height={4}
          borderStyle="single"
          borderTop
          borderBottom
        />
        <SizeBox width={20} height={4} />
      </Box>
    </React.Fragment>
  );
}

render(<App />);
