
// const ZOMBIE_DIST_PER_TURN = 400
// const PLAYER_DIST_PER_TURN = 1000

interface CharacterPosition {
  id: number
  x: number
  y: number
}

function getDistance(a: CharacterPosition, b: CharacterPosition): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

type HumanZombieDistances = Record<string, Record<string, number>>

function getHumanZombieDistances(humans: CharacterPosition[], zombiesCur: CharacterPosition[]): HumanZombieDistances {
  const output: HumanZombieDistances = {}
  for (const human of humans) {
    for (const zombie of zombiesCur) {
      if (!output[human.id]) {
        output[human.id] = {}
      }
      output[human.id][zombie.id] = getDistance(human, zombie)
    }
  }
  return output
}

function getMostImperiledHuman(humanZombieDistances: HumanZombieDistances): number {
  const humanIds = Object.keys(humanZombieDistances)
  return humanIds.reduce((prev: {minDist: number, humanId: number}, cur: string) => {
    const minDist = Math.min(...Object.values(humanZombieDistances[cur]))
    return (prev.minDist > minDist) ? {humanId: parseInt(cur), minDist} : prev
  }, {minDist: Infinity, humanId: -1}).humanId
}

export function getNextMove({
                              curX,
                              curY,
                              humanCount,
                              humans,
                              zombiesCur,
                              zombiesNext
                            }: {
  curX: number,
  curY: number,
  humans: Record<number, CharacterPosition>,
  zombiesCur: Record<number, CharacterPosition>,
  zombiesNext: Record<number, CharacterPosition>,
  humanCount: number
}){
  const closestHumanId = getMostImperiledHuman(getHumanZombieDistances(Object.values(humans), Object.values(zombiesCur)))
  const closestHuman = humans[closestHumanId]
  let nextX = closestHuman.x
  let nextY = closestHuman.y
  return {
    nextX,
    nextY
  }
}

console.log(getNextMove({
  curX: 0,
  curY: 0,
  humanCount: 1,
  humans: [{id: 0, x: 10, y: 10}],
  zombiesCur: [{id: 1, x: 20, y: 0}],
  zombiesNext: []
}))
