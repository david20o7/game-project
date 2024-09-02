export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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

export function getRandomColour() {
  let red = Math.random() * 255;
  let green = Math.random() * 255;
  let blue = Math.random() * 255;

  let rgb = red + green + blue;

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

// not using this right now
function areCircleAndSquareColliding(circleElement, squareElement) {
  // Get the bounding rectangles for both elements
  const circleRect = circleElement.getBoundingClientRect();
  const squareRect = squareElement.getBoundingClientRect();

  // Calculate the circle's center and radius
  const circleRadius = circleRect.width / 2;
  const circleCenterX = circleRect.left + circleRadius;
  const circleCenterY = circleRect.top + circleRadius;

  // Find the closest point on the square to the circle's center
  const closestX = Math.max(squareRect.left, Math.min(circleCenterX, squareRect.right));
  const closestY = Math.max(squareRect.top, Math.min(circleCenterY, squareRect.bottom));

  // Calculate the distance from the closest point to the circle's center
  const distanceX = circleCenterX - closestX;
  const distanceY = circleCenterY - closestY;

  // Determine if the distance is less than the circle's radius
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < circleRadius * circleRadius;
}
