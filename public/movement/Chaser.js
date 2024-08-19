export class Chaser extends Entity {
  constructor(arenaDims, initialState) {
    super(arenaDims, {
      ...initialState,
    });
  }

  /**
   * @param { [x:number, y:number] } playerPosition
   */
  updateChaserPosition(playerPosition) {}
}
