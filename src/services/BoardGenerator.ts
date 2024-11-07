import { CellType, Cell, BoardConfig, Position, Monster, Special, Ingredient } from '@/types/GameTypes'

export class BoardGenerator {
  private config: BoardConfig
  private board: Cell[][] = []

  constructor() {
    this.config = {
      size: 8,
      distribution: {
        [CellType.EMPTY]: 0.25,
        [CellType.INGREDIENT]: 0.35,
        [CellType.OBSTACLE]: 0.1,
        [CellType.MONSTER]: 0.15,
        [CellType.SPECIAL]: 0.1,
        [CellType.DENSE_WOOD]: 0.05,
        [CellType.SPAWN]: 0
      }
    }
  }

  public generateBoard(size: 8 | 10): Cell[][] {
    this.config.size = size
    this.initializeEmptyBoard()
    this.createSpawnPoints()
    
    let isValid = false
    let attempts = 0
    const maxAttempts = 10

    while (!isValid && attempts < maxAttempts) {
      this.initializeEmptyBoard()
      this.createSpawnPoints()
      this.generateDenseWoodPatterns()
      
      if (this.validatePathsBetweenSpawns()) {
        isValid = true
        this.distributeElementsSymmetrically()
      } else {
        attempts++
      }
    }

    if (!isValid) {
      // Si après plusieurs tentatives aucune configuration valide n'est trouvée,
      // générer une carte avec moins de bois dense
      this.generateSafeBoard()
    }

    return this.board
  }

  private initializeEmptyBoard(): void {
    this.board = Array(this.config.size).fill(null).map((_, y) =>
      Array(this.config.size).fill(null).map((_, x) => ({
        type: CellType.EMPTY,
        x,
        y
      }))
    )
  }

  private createSpawnPoints(): void {
    // Coins supérieurs
    this.board[0][0].type = CellType.SPAWN
    this.board[0][this.config.size - 1].type = CellType.SPAWN
    
    // Coins inférieurs
    this.board[this.config.size - 1][0].type = CellType.SPAWN
    this.board[this.config.size - 1][this.config.size - 1].type = CellType.SPAWN

    // Points de spawn additionnels pour 6 joueurs (si taille 10x10)
    if (this.config.size === 10) {
      this.board[0][Math.floor(this.config.size / 2)].type = CellType.SPAWN
      this.board[this.config.size - 1][Math.floor(this.config.size / 2)].type = CellType.SPAWN
    }
  }

  private distributeElementsSymmetrically(): void {
    const halfSize = Math.floor(this.config.size / 2)
    const positions = this.getHalfBoardPositions()
    this.shuffleArray(positions)

    // Traiter d'abord les cases adjacentes aux spawns
    positions.forEach(([x, y]) => {
      if (this.isAdjacentToSpawn(x, y)) {
        // 60% de chance d'être vide, 40% d'avoir un ingrédient
        const shouldBeEmpty = Math.random() < 0.6
        const type = shouldBeEmpty ? CellType.EMPTY : CellType.INGREDIENT
        const content = shouldBeEmpty ? undefined : this.generateContent(type)

        // Place l'élément près du spawn
        this.board[y][x] = {
          type,
          x,
          y,
          content
        }

        // Place l'élément symétrique
        const symmetricX = this.config.size - 1 - x
        const symmetricY = this.config.size - 1 - y
        
        if (!this.isSpawnPoint(symmetricX, symmetricY)) {
          this.board[symmetricY][symmetricX] = {
            type,
            x: symmetricX,
            y: symmetricY,
            content: content ? { ...content } : undefined
          }
        }
      }
    })

    // Filtrer les positions déjà traitées
    const remainingPositions = positions.filter(([x, y]) => 
      !this.isAdjacentToSpawn(x, y) && this.board[y][x].type === CellType.EMPTY
    )
    
    let currentIndex = 0
    const totalRemainingCells = remainingPositions.length

    // Distribution sur les cases restantes
    for (const type of Object.values(CellType)) {
      if (type === CellType.SPAWN || type === CellType.DENSE_WOOD || 
          type === CellType.EMPTY) continue
      
      const count = Math.floor(totalRemainingCells * this.config.distribution[type])
      for (let i = 0; i < count && currentIndex < remainingPositions.length; i++) {
        const [x, y] = remainingPositions[currentIndex]
        
        if (!this.isSpawnPoint(x, y)) {
          const content = this.generateContent(type)

          this.board[y][x] = {
            type,
            x,
            y,
            content
          }

          const symmetricX = this.config.size - 1 - x
          const symmetricY = this.config.size - 1 - y
          
          if (!this.isSpawnPoint(symmetricX, symmetricY)) {
            this.board[symmetricY][symmetricX] = {
              type,
              x: symmetricX,
              y: symmetricY,
              content: content ? { ...content } : undefined
            }
          }
        }
        currentIndex++
      }
    }
  }

  private isAdjacentToSpawn(x: number, y: number): boolean {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],  [0, 0],  [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ]
    
    return directions.some(([dx, dy]) => {
      const newX = x + dx
      const newY = y + dy
      return this.isValidPosition(newX, newY) && this.isSpawnPoint(newX, newY)
    })
  }

  private isSpawnPoint(x: number, y: number): boolean {
    return this.board[y][x].type === CellType.SPAWN
  }

  private getHalfBoardPositions(): number[][] {
    const positions: number[][] = []
    const halfSize = Math.ceil(this.config.size / 2)
    
    for (let y = 0; y < this.config.size; y++) {
      for (let x = 0; x < halfSize; x++) {
        if (!this.isSpawnPoint(x, y)) {
          positions.push([x, y])
        }
      }
    }
    return positions
  }

  private generateContent(type: CellType): Monster | Special | undefined {
    switch (type) {
      case CellType.MONSTER:
        return this.generateMonster()
      case CellType.SPECIAL:
        return this.generateSpecial()
      default:
        return undefined
    }
  }

  // private generateIngredient(): Ingredient {
  //   const ingredients = [
  //     'Champignon magique',
  //     'Cristal de mana',
  //     'Herbe mystique',
  //     'Poudre de fée',
  //     'Racine ancienne',
  //     'Baie enchantée',
  //     'Plume de phénix',
  //     'Essence élémentaire'
  //   ]
  //   return {
  //     id: `ing_${Math.random().toString(36).substr(2, 9)}`,
  //     name: ingredients[Math.floor(Math.random() * ingredients.length)],
  //     variant: Math.floor(Math.random() * 3) + 1
  //   }
  // }

  private generateMonster(): Monster {
    const monsters = [
      'Petit monstre',
      'Monstre moyen',
      'Grand monstre'
    ]
    return {
      id: `mon_${Math.random().toString(36).substr(2, 9)}`,
      name: monsters[Math.floor(Math.random() * monsters.length)],
      variant: Math.floor(Math.random() * 3) + 1
    }
  }

  private generateSpecial(): Special {
    const specials = [
      'Portail',
      'Piège',
      'Fontaine',
      'Autel'
    ]
    return {
      id: `spe_${Math.random().toString(36).substr(2, 9)}`,
      name: specials[Math.floor(Math.random() * specials.length)],
      variant: Math.floor(Math.random() * 3) + 1
    }
  }

  private getAllPositions(): number[][] {
    const positions: number[][] = []
    for (let y = 0; y < this.config.size; y++) {
      for (let x = 0; x < this.config.size; x++) {
        positions.push([x, y])
      }
    }
    return positions
  }

  private shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }

  private generateDenseWoodPatterns(): void {
    const halfSize = Math.floor(this.config.size / 2)
    const centerOffset = Math.floor(this.config.size / 2) - 1
    
    // Définir la zone centrale à protéger (2x2 au milieu)
    const protectedCenter = [
      [centerOffset, centerOffset],
      [centerOffset + 1, centerOffset],
      [centerOffset, centerOffset + 1],
      [centerOffset + 1, centerOffset + 1]
    ]

    // Générer les patterns dans la première moitié du plateau
    const patterns = this.generateBalancedWoodPatterns()
    
    patterns.forEach(pattern => {
      // Vérifier que le pattern ne touche pas les bordures ou le centre
      if (this.isValidWoodPattern(pattern, protectedCenter)) {
        this.applyWoodPattern(pattern)
      }
    })
  }

  private generateBalancedWoodPatterns(): number[][][] {
    const patterns: number[][][] = []
    const numPatterns = Math.floor(this.config.size / 4) // Nombre de patterns par moitié

    for (let i = 0; i < numPatterns; i++) {
      // Choisir un point de départ valide (pas sur les bords)
      const startX = 1 + Math.floor(Math.random() * (this.config.size / 2 - 3))
      const startY = 1 + Math.floor(Math.random() * (this.config.size - 3))
      
      // Générer un pattern linéaire de 3 cases avec possible diagonale
      const pattern = this.generateSingleWoodPattern(startX, startY)
      patterns.push(pattern)
    }

    return patterns
  }

  private generateSingleWoodPattern(startX: number, startY: number): number[][] {
    const pattern: number[][] = [[startX, startY]]
    
    // Choisir une direction principale (horizontale ou verticale)
    const isHorizontal = Math.random() > 0.5
    const mainDirection = isHorizontal ? [1, 0] : [0, 1]
    
    // Ajouter 2 cases dans la direction principale
    for (let i = 1; i < 3; i++) {
      pattern.push([
        startX + (mainDirection[0] * i),
        startY + (mainDirection[1] * i)
      ])
    }

    // 50% de chance d'ajouter une diagonale à partir de la dernière case
    if (Math.random() > 0.5) {
      const lastX = pattern[2][0]
      const lastY = pattern[2][1]
      const diagonalDirections = [
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ]
      
      const validDiagonals = diagonalDirections.filter(([dx, dy]) => {
        const newX = lastX + dx
        const newY = lastY + dy
        return this.isValidWoodPosition(newX, newY)
      })

      if (validDiagonals.length > 0) {
        const [dx, dy] = validDiagonals[Math.floor(Math.random() * validDiagonals.length)]
        pattern.push([lastX + dx, lastY + dy])
      }
    }

    return pattern
  }

  private isValidWoodPattern(pattern: number[][], protectedCenter: number[][]): boolean {
    return pattern.every(([x, y]) => {
      // Vérifier que la case n'est pas sur les bords
      if (x <= 0 || x >= this.config.size - 1 || y <= 0 || y >= this.config.size - 1) {
        return false
      }

      // Vérifier que la case n'est pas dans la zone centrale protégée
      return !protectedCenter.some(([cx, cy]) => cx === x && cy === y)
    })
  }

  private isValidWoodPosition(x: number, y: number): boolean {
    return x > 0 && x < this.config.size - 1 && 
           y > 0 && y < this.config.size - 1 &&
           !this.isSpawnPoint(x, y)
  }

  private applyWoodPattern(pattern: number[][]): void {
    // Appliquer le pattern dans la première moitié
    pattern.forEach(([x, y]) => {
      this.board[y][x] = {
        type: CellType.DENSE_WOOD,
        x,
        y
      }

      // Appliquer la symétrie
      const symmetricX = this.config.size - 1 - x
      const symmetricY = this.config.size - 1 - y
      
      this.board[symmetricY][symmetricX] = {
        type: CellType.DENSE_WOOD,
        x: symmetricX,
        y: symmetricY
      }
    })
  }

  private validatePathsBetweenSpawns(): boolean {
    const spawnPoints = this.getSpawnPoints()
    
    // Vérifier qu'il existe un chemin entre chaque paire de points de spawn
    for (let i = 0; i < spawnPoints.length; i++) {
      for (let j = i + 1; j < spawnPoints.length; j++) {
        if (!this.pathExists(spawnPoints[i], spawnPoints[j])) {
          return false
        }
      }
    }
    return true
  }

  private getSpawnPoints(): Position[] {
    const spawns: Position[] = []
    for (let y = 0; y < this.config.size; y++) {
      for (let x = 0; x < this.config.size; x++) {
        if (this.board[y][x].type === CellType.SPAWN) {
          spawns.push({ x, y })
        }
      }
    }
    return spawns
  }

  private pathExists(start: Position, end: Position): boolean {
    const visited = new Set<string>()
    const queue: Position[] = [start]
    
    while (queue.length > 0) {
      const current = queue.shift()!
      const key = `${current.x},${current.y}`
      
      if (current.x === end.x && current.y === end.y) {
        return true
      }
      
      if (visited.has(key)) continue
      visited.add(key)
      
      // Vérifier les cases adjacentes (y compris en diagonale)
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ]
      
      for (const [dx, dy] of directions) {
        const newX = current.x + dx
        const newY = current.y + dy
        
        if (this.isValidMove(newX, newY) && !visited.has(`${newX},${newY}`)) {
          queue.push({ x: newX, y: newY })
        }
      }
    }
    
    return false
  }

  private isValidMove(x: number, y: number): boolean {
    return x >= 0 && x < this.config.size &&
           y >= 0 && y < this.config.size &&
           this.board[y][x].type !== CellType.DENSE_WOOD
  }

  private generateSafeBoard(): void {
    // Réinitialiser le plateau
    this.initializeEmptyBoard()
    this.createSpawnPoints()
    
    // Générer moins de bois dense et de manière plus espacée
    const reducedPatterns = this.generateBalancedWoodPatterns().slice(0, Math.floor(this.config.size / 4))
    
    reducedPatterns.forEach((pattern: number[][]) => {
      pattern.forEach(([x, y]) => {
        if (!this.isSpawnPoint(x, y) && this.hasEnoughSpace(x, y)) {
          this.board[y][x].type = CellType.DENSE_WOOD
          
          // Appliquer la symétrie
          const symmetricX = this.config.size - 1 - x
          const symmetricY = this.config.size - 1 - y
          if (!this.isSpawnPoint(symmetricX, symmetricY)) {
            this.board[symmetricY][symmetricX].type = CellType.DENSE_WOOD
          }
        }
      })
    })
    
    this.distributeElementsSymmetrically()
  }

  private hasEnoughSpace(x: number, y: number): boolean {
    // Vérifier qu'il y a assez d'espace autour de la position
    const spacing = 2 // Distance minimale entre les bois denses
    
    for (let dy = -spacing; dy <= spacing; dy++) {
      for (let dx = -spacing; dx <= spacing; dx++) {
        const newX = x + dx
        const newY = y + dy
        
        if (this.isValidPosition(newX, newY) && 
            this.board[newY][newX].type === CellType.DENSE_WOOD) {
          return false
        }
      }
    }
    
    return true
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.config.size && y >= 0 && y < this.config.size
  }
} 