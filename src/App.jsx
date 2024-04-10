/* eslint-disable react/prop-types */
import {  useState } from "react"
import confetti from "canvas-confetti"
import { Square } from "./components/Square"
import { TURNS } from "./constants"
import {  checkEndGame, checkWinnerFrom } from "./board"
import { WinnerModal } from "./components/WinnerModal"
import { resetGameStorage, saveGameToStorage } from "./logic"
export function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if (boardFromStorage) return JSON.parse(boardFromStorage)
    return Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })
  const [winner,setWiner] = useState(null)
  const updateBoard=(index)=>{
    if(board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    saveGameToStorage({
      board: newBoard,
      turn: newTurn
    })
    const newWinner= checkWinnerFrom(newBoard)
    if(newWinner){
      confetti();
      setWiner(newWinner)
    }else if(checkEndGame(newBoard)){
      setWiner(false)
    }
  }
  const resetGame=()=>{
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWiner(null)
    resetGameStorage()
  }
 
  return (
    <main className="board ">
     <h1>Tic Tac Toe</h1>
     <button onClick={resetGame}>Reset the game</button>
     <section className="game">
      {
        board.map((square,index)=>{
          return(
            <Square 
            key={index}
            index={index} 
            updateBoard={updateBoard}           
            >
              {square}
              </Square>
          )
        })
      }
     </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
        <WinnerModal  winner={winner} resetGame={resetGame}/>
    </main>
  )
}


