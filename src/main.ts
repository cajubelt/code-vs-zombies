
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
  return Math.round(Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2))
}

// maps human ID to zombie ID to distance between human, zombie
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

function getMostImperiledSavableHuman(humanZombieDistances: HumanZombieDistances, humans: CharacterPosition[], player: Position): number {
  const dummyId = '-1'
  const playerHumanDistances = humans.reduce((acc, human) => {
    acc[human.id] = getDistance(player, human)
    return acc
  }, {} as Record<string, number>)
  let mostImperiledHumanId: string = dummyId
  let mostImperiledHumanZombieDist: number = Infinity
  for (const [humanId, zombieDistances] of Object.entries(humanZombieDistances)) {
    // find closest zombie to this human
    let closestZombieId: string = dummyId
    let closestZombieDist: number = Infinity
    for (const [zombieId, zombieDist] of Object.entries(zombieDistances)) {
      if (closestZombieId === dummyId || zombieDist < closestZombieDist) {
        closestZombieDist = zombieDist
        closestZombieId = zombieId
      }
    }
    
    // if human first seen, or savable and closest to a zombie, update mostImperiledHumanId
    const playerHumanDistance = playerHumanDistances[humanId]
    const savable = playerHumanDistance / PLAYER_DIST_PER_TURN < closestZombieDist / ZOMBIE_DIST_PER_TURN
    const closestToAZombie = closestZombieDist < mostImperiledHumanZombieDist
    if (
      mostImperiledHumanId === dummyId ||
      (closestToAZombie && savable)
    ) {
      mostImperiledHumanId = humanId
      mostImperiledHumanZombieDist = closestZombieDist
    }
  }
  if (mostImperiledHumanId === dummyId) {
    throw new Error('Got dummyId for most imperiled human. Probably got an empty set of zombie IDs for some human.')
  }
  return parseInt(mostImperiledHumanId)
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
  const zombiePositions = Object.values(zombiesCur)
  let humanPositions = Object.values(humans)
  const humanZombieDistances = getHumanZombieDistances(humanPositions, zombiePositions)
  const closestHumanId = getMostImperiledSavableHuman(humanZombieDistances, humanPositions, {x: curX, y: curY})
  const closestHuman = humans[closestHumanId]
  let nextX = closestHuman.x
  let nextY = closestHuman.y
  return {
    nextX,
    nextY
  }
}
