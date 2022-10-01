
const ZOMBIE_DIST_PER_TURN = 400
const PLAYER_DIST_PER_TURN = 1000

interface Position {
  x: number
  y: number
}


type CharacterPosition = {
  id: number
} & Position

function getDistance(a: Position, b: Position): number {
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

function getMostImperiledSavableHuman(humanZombieDistances: HumanZombieDistances, zombies: CharacterPosition[], player: {x: number, y: number}): number {
  // fixme failing "simple" test case :(
  const humanIds = Object.keys(humanZombieDistances)
  const zombieIds = zombies.map(({id}) => id)
  const playerZombieDistances = zombies.reduce((acc, zombie) => {
    acc[zombie.id] = getDistance(player, zombie)
    return acc
  }, {} as Record<string, number>)
  return humanIds.reduce((prev: {minDist: number, humanId: number}, cur: string) => {
    const zombieDistances = humanZombieDistances[cur]
    let minDist = Infinity
    for (const zombieId of zombieIds) {
      const zombieDistance = zombieDistances[zombieId]
      const playerZombieDistance = playerZombieDistances[zombieId]
      if (
        (playerZombieDistance / PLAYER_DIST_PER_TURN) < (zombieDistance / ZOMBIE_DIST_PER_TURN) &&
        zombieDistance < minDist
      ) {
        // if the zombie is targeting this human, they are too far to save
        // todo could be a bit better to only consider humans that are targeted by the zombie
        minDist = zombieDistance
      }
    }
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
  const zombies = Object.values(zombiesCur)
  const closestHumanId = getMostImperiledSavableHuman(getHumanZombieDistances(Object.values(humans), zombies), zombies, {x: curX, y: curY})
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
