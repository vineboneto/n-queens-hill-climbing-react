const maxInteractions = 100
let nSideMoves = 0
let nSteps = 0

function exists(i, j, length) {
  return i >= 0 && i < length && j >= 0 && j < length
}

function deepCopy(arr) {
  return arr.map(function (arr) {
    return arr.slice()
  })
}

function hillClimbing(board) {
  let minH = 999999
  let nextBoard = deepCopy(board)

  if (nSideMoves >= maxInteractions) {
    return nextBoard
  }

  nSteps += 1

  let sidewayMove = false

  for (let i = 0; i < board.length; i++) {
    const queen = board[i].indexOf(true)
    board[i][queen] = false

    for (let k = 0; k < board[0].length; k++) {
      if (k !== queen) {
        board[i][k] = true
        let h = findAllIndexAttacks(board).length / 2
        if (h <= minH) {
          minH = h
          nextBoard = deepCopy(board)
          sidewayMove = true
        }
        board[i][k] = false
      }
    }
    board[i][queen] = true
  }

  if (sidewayMove) {
    nSideMoves += 1
  }

  if (minH === 0) {
    return nextBoard
  }

  return hillClimbing(nextBoard)
}

function findAllIndexAttacks(board) {
  const queensPar = []
  const indexAttacks = []
  let l = 0
  let m = 0
  let h = 0

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j]) {
        // Calculate horizontal attacks
        for (let k = 0; k < board.length; k++) {
          const isQueen = board[i][k] === true
          const isNotSelfElement = j !== k
          if (isQueen && isNotSelfElement) {
            indexAttacks.push([i, j])
          }
        }

        // Calculate vertical attacks
        for (let k = 0; k < board.length; k++) {
          const isQueen = board[k][j] === true
          const isNotSelfElement = i !== k
          if (isQueen && isNotSelfElement) {
            indexAttacks.push([k, j])
          }
        }

        // Calculate / diagonal attacks
        // First go up the diagonal
        l = i - 1
        m = j + 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          if (isQueen) {
            indexAttacks.push([l, m])
          }
          l = l - 1
          m = m + 1
        }

        // Now go down the diagonal
        l = i + 1
        m = j - 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          if (isQueen) {
            indexAttacks.push([l, m])
          }
          l = l + 1
          m = m - 1
        }

        //Calculate \ diagonal attacks
        // First go up the diagonal
        l = i - 1
        m = j - 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          if (isQueen) {
            indexAttacks.push([l, m])
          }
          l = l - 1
          m = m - 1
        }

        // Now go down the diagonal
        l = i + 1
        m = j + 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          if (isQueen) {
            indexAttacks.push([l, m])
          }
          l = l + 1
          m = m + 1
        }
      }
    }
  }

  return indexAttacks
}

export function executeHillClimbing(board) {
  nSteps = 0
  nSideMoves = 0
  const finalBoard = hillClimbing(board)
  const attacks = findAllIndexAttacks(finalBoard)

  return { finalBoard, nSteps, attacks }
}
