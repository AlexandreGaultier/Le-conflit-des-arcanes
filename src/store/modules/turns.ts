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
    startingPlayer: null as string | null
  }),

  getters: {
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
      this.phase = TurnPhase.START
      this.actionsLeft = 3
      this.turnNumber = 1

      const charactersStore = useCharactersStore()
      if (this.currentPlayerId) {
        charactersStore.selectCharacter(this.currentPlayerId)
        console.log('Personnage sélectionné:', this.currentPlayerId)
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

    useAction(cost: number = 1) {
      if (this.canPerformAction && this.actionsLeft >= cost) {
        this.actionsLeft -= cost
        if (this.actionsLeft === 0) {
          this.phase = TurnPhase.END
        }
        return true
      }
      return false
    },

    endTurn() {
      // Appliquer les effets de fin de tour
      this.activeEffects.forEach((effect, index) => {
        if (effect.type === 'end') {
          effect.effect()
        }
        effect.duration--
        if (effect.duration <= 0) {
          this.activeEffects.splice(index, 1)
        }
      })

      const charactersStore = useCharactersStore()
      const currentIndex = charactersStore.characters.findIndex(c => c.id === this.currentPlayerId)
      const nextIndex = (currentIndex + 1) % charactersStore.characters.length
      this.currentPlayerId = charactersStore.characters[nextIndex].id
      charactersStore.selectCharacter(this.currentPlayerId)
      
      this.turnNumber++
      this.startTurn()
    },

    addEffect(effect: { id: string; type: string; duration: number; effect: () => void }) {
      this.activeEffects.push(effect)
    }
  }
}) 