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

  it('should create symmetric content on X axis', () => {
    const board = generator.generateBoard(8)
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 4; x++) {
        const cell = board[y][x]
        const symmetricCell = board[y][7 - x]
        
        // On ne vérifie que les cellules qui ne sont pas des spawns ou du bois dense
        if (cell.type !== CellType.SPAWN && 
            cell.type !== CellType.DENSE_WOOD && 
            symmetricCell.type !== CellType.SPAWN && 
            symmetricCell.type !== CellType.DENSE_WOOD) {
          
          // Vérifier uniquement que les types sont symétriques
          expect(cell.type).toBe(symmetricCell.type)
          
          // Vérifier que si une cellule a du contenu, sa symétrique en a aussi
          if (cell.content) {
            expect(symmetricCell.content).toBeTruthy()
          }
        }
      }
    }
  })

  it('should protect spawn areas', () => {
    const board = generator.generateBoard(8)
    
    // Trouver tous les spawns
    const spawnPositions = []
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
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
        
        if (newX >= 0 && newX < board.length && newY >= 0 && newY < board.length) {
          const adjacentCell = board[newY][newX]
          expect([CellType.EMPTY, CellType.INGREDIENT, CellType.SPAWN])
            .toContain(adjacentCell.type)
        }
      })
    })
  })

  it('should have reasonable distribution of cell types', () => {
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

    // Vérifier que les spawns sont présents
    expect(distribution[CellType.SPAWN]).toBe(4) // 4 spawns pour un plateau 8x8

    // Vérifier que le bois dense est présent mais pas trop
    expect(distribution[CellType.DENSE_WOOD]).toBeGreaterThan(0)
    expect(distribution[CellType.DENSE_WOOD]).toBeLessThan(10)

    // Vérifier qu'il y a une bonne proportion d'ingrédients
    expect(distribution[CellType.INGREDIENT]).toBeGreaterThan(
      distribution[CellType.MONSTER]
    )

    // Vérifier qu'il y a moins d'objets spéciaux que d'ingrédients
    expect(distribution[CellType.SPECIAL]).toBeLessThan(
      distribution[CellType.INGREDIENT]
    )
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

  it('should maintain gameplay balance on X axis', () => {
    const board = generator.generateBoard(8)
    
    // Compter les types de cellules de chaque côté
    const leftSide: { [key in CellType]: number } = {
      [CellType.EMPTY]: 0,
      [CellType.INGREDIENT]: 0,
      [CellType.OBJECT]: 0,
      [CellType.MONSTER]: 0,
      [CellType.SPECIAL]: 0,
      [CellType.SPAWN]: 0,
      [CellType.DENSE_WOOD]: 0
    }

    const rightSide: { [key in CellType]: number } = {
      [CellType.EMPTY]: 0,
      [CellType.INGREDIENT]: 0,
      [CellType.OBJECT]: 0,
      [CellType.MONSTER]: 0,
      [CellType.SPECIAL]: 0,
      [CellType.SPAWN]: 0,
      [CellType.DENSE_WOOD]: 0
    }

    const midPoint = Math.floor(board.length / 2)

    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
        if (x < midPoint) {
          leftSide[board[y][x].type]++
        } else {
          rightSide[board[y][x].type]++
        }
      }
    }

    // Vérifier que la distribution est équilibrée entre les deux côtés
    for (const type of Object.values(CellType)) {
      // On permet une différence de ±2 pour chaque type
      const difference = Math.abs(leftSide[type] - rightSide[type])
      expect(difference).toBeLessThanOrEqual(2)
    }

    // Vérifier spécifiquement les spawns
    expect(leftSide[CellType.SPAWN]).toBe(rightSide[CellType.SPAWN])

    // Vérifier que les deux côtés ont un nombre similaire de cases avec du contenu
    const leftContent = Object.values(leftSide).reduce((a, b) => a + b, 0) - leftSide[CellType.EMPTY]
    const rightContent = Object.values(rightSide).reduce((a, b) => a + b, 0) - rightSide[CellType.EMPTY]
    expect(Math.abs(leftContent - rightContent)).toBeLessThanOrEqual(2)
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