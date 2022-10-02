import { getNextMove } from "./main"

describe('getNextMove', () => {
  it('goes towards most imperiled savable human', () => {
    const {nextX, nextY} = getNextMove({
      curX: 8000,
      curY: 0,
      humanCount: 2,
      humans: {2: {id: 2, x: 8000, y: 7999}, 0: {id: 0, x: 0, y: 4500}},
      zombiesCur: {
        5: {id: 5, x: 9000, y: 5400},
        22: {id: 22, x: 1000, y: 8400}
      },
      zombiesNext: {
        5: {id: 5, x: 8856, y: 5773},
        22: {id: 22, x: 900, y: 8012}
      }
    })
    expect(nextX).toEqual(0)
    expect(nextY).toEqual(4500)
  })
})
