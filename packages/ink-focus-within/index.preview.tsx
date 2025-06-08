#!/usr/bin/env node --no-warnings --import tsx

import * as React from 'react';
import { render, useApp, useFocus, useInput, Box, Text } from 'ink';
import {
  FocusedIdProvider,
  NestedIdProvider,
  useFocusWithin,
  useFocusedId,
  useNestedId
} from './index';

//------------------------------------------------------------------------------

type ItemProps = {
  children: React.ReactNode;
  id: string;
};

function Item(props: ItemProps) {
  const { id, children } = props;

  const { isFocused } = useFocus({ id });
  const { useSetFocusedId } = useFocusedId();
  const { nestedId } = useNestedId();

  useSetFocusedId({
    id,
    isFocused,
    nestedId
  });

  return <Text inverse={isFocused}>{children}</Text>;
}

//------------------------------------------------------------------------------

type FrameProps = {
  children: React.ReactNode;
  id: string;
};

function Frame(props: FrameProps) {
  const { children, id } = props;

  const isFocusWithin = useFocusWithin(id);

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      width="100%"
      borderColor={isFocusWithin ? 'red' : 'white'}
    >
      <NestedIdProvider id={id}>{children}</NestedIdProvider>
    </Box>
  );
}

//------------------------------------------------------------------------------

function Body() {
  const { focusedId } = useFocusedId();

  return (
    <React.Fragment>
      <Text bold>
        press q to exit | press tab to change focus | focusedId:
        {focusedId || 'none'}
      </Text>
      <Box flexDirection="row" width="100%">
        <Frame id="frame-1">
          <Item id="item-1">item-1</Item>
          <Item id="item-2">item-2</Item>
          <Item id="item-3">item-3</Item>
        </Frame>
        <Frame id="frame-2">
          <Item id="item-4">item-4</Item>
          <Item id="item-5">item-5</Item>
          <Item id="item-6">item-6</Item>
        </Frame>
        <Frame id="frame-3">
          <Item id="item-a">item-a</Item>
          <Item id="item-b">item-b</Item>
          <Item id="item-c">item-c</Item>
          <Frame id="frame-3-1">
            <Item id="item-d">item-d</Item>
            <Item id="item-e">item-e</Item>
            <Item id="item-f">item-f</Item>
          </Frame>
        </Frame>
      </Box>
    </React.Fragment>
  );
}

//------------------------------------------------------------------------------

function App() {
  const { exit } = useApp();

  useInput((input) => {
    if (input === 'q') {
      exit();
    }
  });

  return (
    <React.Fragment>
      <FocusedIdProvider>
        <Body />
      </FocusedIdProvider>
    </React.Fragment>
  );
}

render(<App />);
