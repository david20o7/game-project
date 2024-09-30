/**
 * ensures that the number cannot be smaller than min,
 * but cannot be larger than max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * checks collisions between two entities
 * and returns true if they collide
 */
export function checkCollision(entityOne, entityTwo) {
  const entityOneBounds = entityOne.getBounds();
  const entityTwoBounds = entityTwo.getBounds();

  if (
    entityOneBounds.left < entityTwoBounds.right &&
    entityOneBounds.right > entityTwoBounds.left &&
    entityOneBounds.bottom < entityTwoBounds.top &&
    entityOneBounds.top > entityTwoBounds.bottom
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Fancy function which checks whether a circle and a square intersect
 * Used to determine whether an attack hits for now.
 */
export function areCircleAndSquareColliding(circleElement, squareElement) {
  // Get the bounding rectangles for both elements
  const circleDimensions = circleElement.getCircle();
  const squareElementBounds = squareElement.getBounds();

  // Calculate the circle's center and radius
  const circleRadius = circleDimensions.radius;
  const circleCenterX = circleDimensions.center[0];
  const circleCenterY = circleDimensions.center[1];

  // Find the closest point on the square to the circle's center
  const closestX = Math.max(
    squareElementBounds.left,
    Math.min(circleCenterX, squareElementBounds.right)
  );
  const closestY = Math.max(
    squareElementBounds.top,
    Math.min(circleCenterY, squareElementBounds.bottom)
  );

  // Calculate the distance from the closest point to the circle's center
  const distanceX = circleCenterX - closestX;
  const distanceY = circleCenterY - closestY;

  // Determine if the distance is less than the circle's radius
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < circleRadius * circleRadius;
}

/**
 * Gets a random edge of the box.
 */
export function getRandomEdge(arenaDims) {
  const prob = Math.random();

  if (prob < 0.25) {
    // bottom
    return [Math.random() * arenaDims[0], 0];
  } else if (prob < 0.5) {
    // left
    return [0, Math.random() * arenaDims[1]];
  } else if (prob < 0.75) {
    // up
    return [Math.random() * arenaDims[0], arenaDims[1]];
  } else {
    // right
    return [arenaDims[0], Math.random() * arenaDims[1]];
  }
}

/**
 * Generates a random colour, but makes sure it's at least 100 units bright
 * used for generating chaser colours as they spawn.
 */
export function getRandomColour() {
  let red = Math.random() * 255;
  let green = Math.random() * 255;
  let blue = Math.random() * 255;

  let rgb = red + green + blue;
  // increases the rgb of the colour if it is too dark
  if (rgb < 100) {
    let remainder = 100 - rgb;
    remainder = remainder / 3;
    remainder = Math.round(remainder);
    red += remainder;
    green += remainder;
    blue += remainder;
    rgb = red + green + blue;
  }

  let randomColour = [red, green, blue];

  return randomColour;
}

// y = mx + c
// assigns a speed compared to its size
export function getSpeedFromSize(size) {
  return -0.05 * size + 3;
}
// gets a random size in between 10 and 40.
export function getRandomSize() {
  const SPEED_OFFSET = 10;
  const SPEED_RANGE = 30;
  return Math.random() * SPEED_RANGE + SPEED_OFFSET;
}
