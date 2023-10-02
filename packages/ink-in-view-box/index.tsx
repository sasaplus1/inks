import type { BoxProps, DOMElement } from 'ink';

import { measureElement, Box } from 'ink';
import * as React from 'react';

const isNotProduction = process.env['NODE_ENV'] !== 'production';

export type Props = {
  children: React.ReactNode[];
  /** cursor index */
  cursor: number;
  /** initial height */
  initialHeight?: number;
  /** initial offset */
  initialOffset?: number;
} & BoxProps;

/**
 * a box that can be scrolled and manage cursor
 * add border is not recommended
 *
 * @param props - props
 */
export function InViewBox(props: Props) {
  const {
    children,
    cursor,
    initialHeight = 0,
    initialOffset = 0,
    ...boxProps
  } = props;

  if (isNotProduction && (cursor < 0 || cursor > children.length - 1)) {
    console.warn('cursor is out of range');
  }

  const ref = React.useRef<DOMElement>(null);

  const [height, setHeight] = React.useState(initialHeight);

  React.useLayoutEffect(() => {
    if (ref && ref.current) {
      setHeight(measureElement(ref.current).height);
    }
  }, [ref, props.height]);

  const offset = React.useRef(initialOffset);

  const slice = {
    start: offset.current,
    end: height + offset.current
  };

  // move to cursor position if cursor is out of range
  if (cursor < offset.current) {
    slice.start = cursor;
    slice.end = cursor + height;
  } else if (cursor > height + offset.current - 1) {
    slice.start = cursor - height + 1;
    slice.end = cursor + 1;
  }

  // reset offset if out of range
  if (slice.start < 0) {
    offset.current = 0;
  } else if (slice.start > children.length - 1) {
    offset.current = children.length - 1;
  } else {
    offset.current = slice.start;
  }

  return (
    <Box {...boxProps} flexDirection="column" ref={ref}>
      {children.slice(slice.start, slice.end)}
    </Box>
  );
}
