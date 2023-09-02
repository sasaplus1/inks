import type { BoxProps, DOMElement } from 'ink';

import { measureElement, Box } from 'ink';
import * as React from 'react';

export type Props = {
  children: React.ReactNode[];
  /** children offset */
  offset: number;
} & BoxProps;

/**
 * a box that can be scrolled
 * add border is not recommended
 *
 * @param props - props
 */
export function ScrollBox(props: Props) {
  const { children, offset, ...boxProps } = props;

  const ref = React.useRef<DOMElement>(null);

  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (ref && ref.current) {
      setHeight(measureElement(ref.current).height);
    }
  }, []);

  return (
    <Box {...boxProps} flexDirection="column" ref={ref}>
      {children.slice(offset, height + offset)}
    </Box>
  );
}
