import { defineStore } from 'pinia'
import { TurnPhase, TurnState } from '@/types/TurnTypes'
import { useCharactersStore } from './characters'

export const useTurnsStore = defineStore('turns', {
  state: (): TurnState => ({
    currentPlayerId: null,
    phase: TurnPhase.START,
    actionsLeft: 3,
    turnNumber: 1,
    activeEffects: [],
    diceRollResult: null as number | null,
    startingPlayer: null as string | null,
    hasMovedThisTurn: false
  }),

  getters: {
    canMove: (state) => state.phase === TurnPhase.ACTION && !state.hasMovedThisTurn,
    canPerformAction(): boolean {
      return this.phase === TurnPhase.ACTION && this.actionsLeft > 0
    },
    
    currentPhaseText(): string {
      const phases = {
        [TurnPhase.START]: 'Début de tour',
        [TurnPhase.ACTION]: 'Phase d\'action',
        [TurnPhase.END]: 'Fin de tour'
      }
      return phases[this.phase]
    }
  },

  actions: {
    rollDiceForStart() {
      const charactersStore = useCharactersStore()
      const diceResult = Math.floor(Math.random() * 6) + 1
      this.diceRollResult = diceResult
      
      const firstPlayer = charactersStore.characters[0]
      const secondPlayer = charactersStore.characters[1]
      
      if (diceResult <= 3) {
        this.startingPlayer = firstPlayer.name
        this.currentPlayerId = firstPlayer.id
      } else {
        this.startingPlayer = secondPlayer.name
        this.currentPlayerId = secondPlayer.id
      }
      
      charactersStore.selectCharacter(this.currentPlayerId)
      return {
        diceResult,
        startingPlayer: this.startingPlayer
      }
    },

    startGame() {
      const { diceResult, startingPlayer } = this.rollDiceForStart()
      this.phase = TurnPhase.ACTION
      this.actionsLeft = 3
      this.turnNumber = 1
      this.hasMovedThisTurn = false

      const charactersStore = useCharactersStore()
      if (this.currentPlayerId) {
        charactersStore.selectCharacter(this.currentPlayerId)
      }

      return { diceResult, startingPlayer }
    },

    startTurn() {
      this.phase = TurnPhase.START
      this.actionsLeft = 3
      // Appliquer les effets de début de tour
      this.activeEffects.forEach(effect => {
        if (effect.type === 'start') {
          effect.effect()
        }
      })
      this.phase = TurnPhase.ACTION
    },

    useAction(cost: number = 1): boolean {
      if (this.actionsLeft >= cost) {
        this.actionsLeft -= cost
        console.log(`Action utilisée. Actions restantes: ${this.actionsLeft}`)
        return true
      }
      return false
    },

    useMovement() {
      if (this.canMove) {
        this.hasMovedThisTurn = true
        return true
      }
      return false
    },

    endTurn() {
      // Réinitialiser pour le prochain joueur
      this.actionsLeft = 3
      this.hasMovedThisTurn = false

      // Changer de joueur
      const charactersStore = useCharactersStore()
      const characters = charactersStore.characters
      const currentIndex = characters.findIndex(c => c.id === this.currentPlayerId)
      const nextIndex = (currentIndex + 1) % characters.length
      this.currentPlayerId = characters[nextIndex].id

      // Sélectionner le nouveau joueur
      charactersStore.selectCharacter(this.currentPlayerId)

      // Incrémenter le numéro du tour si on revient au premier joueur
      if (nextIndex === 0) {
        this.turnNumber++
      }

      console.log('Tour terminé, au joueur suivant:', this.currentPlayerId)
    },

    addEffect(effect: { id: string; type: string; duration: number; effect: () => void }) {
      this.activeEffects.push(effect)
    }
  }
}) 