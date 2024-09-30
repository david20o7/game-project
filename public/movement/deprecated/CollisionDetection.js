import { Player } from "./Player.js";
import { Chaser } from "./Chaser.js";

export class CollisionDetector {
  constructor(player, chaser) {
    this.player = player;
    this.chaser = chaser;
  }

  areCircleAndSquareColliding(circleElement, squareElement) {
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

  checkCollision() {
    this.spriteRect = sprite.getBoundingClientRect();
    this.chaserRect = chaser.getElement().getBoundingClientRect();
  }
}
