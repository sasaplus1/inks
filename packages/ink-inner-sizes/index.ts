import type { BoxProps } from 'ink';

/**
 * calculate inner sizes
 * @param sizes - box sizes
 * @param props - box props
 * @returns inner sizes
 */
export function innerSizes(
  sizes: { width: number; height: number },
  props: BoxProps
) {
  return {
    innerWidth: innerWidth(sizes.width, props),
    innerHeight: innerHeight(sizes.height, props)
  };
}

/**
 * calculate inner width
 * @param width - box width
 * @param props - box props
 * @returns inner width
 */
export function innerWidth(width: number, props: BoxProps) {
  const { borderLeft, borderRight, borderStyle } = props;

  if (borderStyle && !borderLeft && !borderRight) {
    return width - 2;
  }

  let borderWidth = 0;

  if (borderLeft) {
    borderWidth += 1;
  }

  if (borderRight) {
    borderWidth += 1;
  }

  return width - borderWidth;
}

/**
 * calculate inner height
 *
 * @param height - box height
 * @param props - box props
 * @returns inner height
 */
export function innerHeight(height: number, props: BoxProps) {
  const { borderTop, borderBottom, borderStyle } = props;

  if (borderStyle && !borderTop && !borderBottom) {
    return height - 2;
  }

  let borderHeight = 0;

  if (borderTop) {
    borderHeight += 1;
  }

  if (borderBottom) {
    borderHeight += 1;
  }

  return height - borderHeight;
}
