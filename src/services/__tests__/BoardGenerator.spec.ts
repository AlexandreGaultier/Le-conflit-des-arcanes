import { describe, it, expect, beforeEach } from 'vitest'
import { BoardGenerator } from '../BoardGenerator'
import { CellType } from '@/types/GameTypes'

describe('BoardGenerator', () => {
  let generator: BoardGenerator

  beforeEach(() => {
    generator = new BoardGenerator()
  })

  it('should generate a board with correct dimensions', () => {
    const size = 8
    const board = generator.generateBoard(size)
    expect(board.length).toBe(size)
    expect(board[0].length).toBe(size)
  })

  it('should create symmetric content', () => {
    const board = generator.generateBoard(8)
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 4; x++) {
        const cell = board[y][x]
        const symmetricCell = board[y][7 - x]
        
        if (cell.type !== CellType.SPAWN && cell.type !== CellType.DENSE_WOOD) {
          expect(cell.type).toBe(symmetricCell.type)
          if (cell.content) {
            expect(cell.content).toEqual(symmetricCell.content)
          }
        }
      }
    }
  })

  it('should protect spawn areas', () => {
    const board = generator.generateBoard(8)
    const spawnPositions = []
    
    // Trouver tous les spawns
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x].type === CellType.SPAWN) {
          spawnPositions.push({ x, y })
        }
      }
    }

    // Vérifier les cases adjacentes aux spawns
    spawnPositions.forEach(({ x, y }) => {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ]

      directions.forEach(([dx, dy]) => {
        const newX = x + dx
        const newY = y + dy
        
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const adjacentCell = board[newY][newX]
          expect([CellType.EMPTY, CellType.INGREDIENT, CellType.SPAWN])
            .toContain(adjacentCell.type)
        }
      })
    })
  })

  it('should have correct distribution of cell types', () => {
    const board = generator.generateBoard(8)
    const distribution: { [key in CellType]: number } = {
      [CellType.EMPTY]: 0,
      [CellType.INGREDIENT]: 0,
      [CellType.OBJECT]: 0,
      [CellType.MONSTER]: 0,
      [CellType.SPECIAL]: 0,
      [CellType.SPAWN]: 0,
      [CellType.DENSE_WOOD]: 0
    }

    // Compter les types de cellules
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        distribution[board[y][x].type]++
      }
    }

    const totalCells = 8 * 8
    // Vérifier les proportions approximatives
    expect(distribution[CellType.EMPTY]).toBeCloseTo(totalCells * 0.25, -1)
    expect(distribution[CellType.INGREDIENT]).toBeCloseTo(totalCells * 0.35, -1)
    expect(distribution[CellType.OBJECT]).toBeCloseTo(totalCells * 0.1, -1)
    expect(distribution[CellType.MONSTER]).toBeCloseTo(totalCells * 0.15, -1)
    expect(distribution[CellType.SPECIAL]).toBeCloseTo(totalCells * 0.1, -1)
  })

  it('should ensure path exists between all spawn points', () => {
    const board = generator.generateBoard(8)
    const spawnPositions = []
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x].type === CellType.SPAWN) {
          spawnPositions.push({ x, y })
        }
      }
    }

    for (let i = 0; i < spawnPositions.length; i++) {
      for (let j = i + 1; j < spawnPositions.length; j++) {
        const pathExists = hasPath(board, spawnPositions[i], spawnPositions[j])
        expect(pathExists).toBe(true)
      }
    }
  })
})

function hasPath(board: any[][], start: { x: number, y: number }, end: { x: number, y: number }): boolean {
  const visited = new Set<string>()
  const queue = [start]
  
  while (queue.length > 0) {
    const current = queue.shift()!
    const key = `${current.x},${current.y}`
    
    if (current.x === end.x && current.y === end.y) {
      return true
    }
    
    if (visited.has(key)) continue
    visited.add(key)
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    
    for (const [dx, dy] of directions) {
      const newX = current.x + dx
      const newY = current.y + dy
      
      if (newX >= 0 && newX < board.length && 
          newY >= 0 && newY < board.length && 
          board[newY][newX].type !== CellType.DENSE_WOOD) {
        queue.push({ x: newX, y: newY })
      }
    }
  }
  
  return false
} 