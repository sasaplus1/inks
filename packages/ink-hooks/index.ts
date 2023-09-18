import * as React from 'react';
import { useStdout } from 'ink';

/* -- resize ---------------------------------------------------------------- */

/**
 * notify when the terminal is resized
 *
 * @returns columns and rows
 */
export function useResize() {
  const { stdout } = useStdout();

  const [sizes, setSizes] = React.useState({
    columns: stdout.columns,
    rows: stdout.rows
  });

  React.useLayoutEffect(() => {
    const onResize = () => {
      setSizes({
        columns: stdout.columns,
        rows: stdout.rows
      });
    };

    stdout.on('resize', onResize);

    return () => {
      stdout.off('resize', onResize);
    };
  }, [stdout]);

  return {
    columns: sizes.columns,
    rows: sizes.rows,
    // aliases
    width: sizes.columns,
    height: sizes.rows
  };
}

/* -- fullscreen ------------------------------------------------------------ */

const enterAlternateScreenSequence = '\x1b[?1049h';
const leaveAlternateScreenSequence = '\x1b[?1049l';

/**
 * enter fullscreen
 */
export function useFullscreen() {
  const { stdout } = useStdout();

  if (stdout) {
    stdout.write(enterAlternateScreenSequence);
  }

  React.useLayoutEffect(() => {
    return () => {
      if (stdout) {
        stdout.write(leaveAlternateScreenSequence);
      }
    };
  }, [stdout]);
}

/**
 * enter fullscreen
 *
 * @returns a function to exit fullscreen
 */
export function enterFullscreen(): () => void {
  process.stdout.write(enterAlternateScreenSequence);

  return () => {
    process.stdout.write(leaveAlternateScreenSequence);
  };
}
