import {getDistance, getNextMove} from "./main"

describe('getNextMove', () => {
  it('goes towards most imperiled savable human', () => {
    // from start positions of test case 10: Cross
    //  needs to go towards human on the left (bottom one is not savable)
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
  it('stays with human in danger', () => {
    // test case 14: Triangle
    //  needs to stay with human on the left (right ones not savable)
    const {nextX, nextY} = getNextMove({
      curX: 4000,
      curY: 3500,
      humanCount: 2,
      humans: {
        2: {id: 2, x: 4000, y: 3500}, // with player
        0: {id: 0, x: 11000, y: 1000} // top right
      },
      zombiesCur: {
        3: {id: 3, x: 1980, y: 3750}, //
        0: {id: 0, x: 13000, y: 1000}
      },
      zombiesNext: {
        3: {id: 3, x: 2376, y: 3700},
        0: {id: 0, x: 12600, y: 1000}
      }
    })
    const human2 = {id: 2, x: 4000, y: 3500}
    const zombie3 = {id: 3, x: 1980, y: 3750}
    const player = {x: 4000, y: 3500}
    const human0 = {x: 11000, y: 1000}
    const zombie0 = {x: 13000, y: 1000}
    console.log(`human2 to zombie3: ${getDistance(human2, zombie3)}`) // 2035.4115063052975
    console.log(`player to human0: ${getDistance(player, human0)}`) // 7433.034373659253: 8 moves for human
    console.log(`human0 to zombie0: ${getDistance(human0, zombie0)}`) // 2000: 5 moves for zombie
    expect(nextX).toEqual(4000)
    expect(nextY).toEqual(3500)
  })
})
