const maxInteractions = 100
let nSideMoves = 0
let nSteps = 0

function exists(i, j, length) {
  return i >= 0 && i < length && j >= 0 && j < length
}

function contains(i, j, l, m, queensPar) {
  const key1 = JSON.stringify([i, j, l, m])
  const key2 = JSON.stringify([l, m, i, j])
  const already = queensPar.includes(key1) || queensPar.includes(key2)

  if (already) return true
  return false
}

function heuristicValue(board) {
  const queensPar = []
  let l = 0
  let m = 0
  let h = 0

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      if (board[i][j]) {
        //Calcular ataques na horizontal
        for (let k = 0; k < board.length; k++) {
          const isQueen = board[i][k] === true
          const isNotSelfElement = j !== k
          const isNotVisited = !contains(i, j, i, k, queensPar)
          if (isQueen && isNotSelfElement && isNotVisited) {
            const key = JSON.stringify([i, j, i, k])
            queensPar.push(key)
            h += 1
          }
        }

        // Calculate ataques verticais
        for (let k = 0; k < board.length; k++) {
          const isQueen = board[k][j] === true
          const isNotSelfElement = i !== k
          const isNotVisited = !contains(i, j, k, j, queensPar)
          if (isQueen && isNotSelfElement && isNotVisited) {
            const key = JSON.stringify([i, j, k, j])
            queensPar.push(key)
            h += 1
          }
        }

        // Calculate / diagonal attacks
        // First go up the diagonal
        l = i - 1
        m = j + 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          const isNotVisited = !contains(i, j, l, m, queensPar)
          if (isQueen && isNotVisited) {
            const key = JSON.stringify([i, j, l, m])
            queensPar.push(key)
            h += 1
          }
          l = l - 1
          m = m + 1
        }

        // Now go down the diagonal
        l = i + 1
        m = j - 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          const isNotVisited = !contains(i, j, l, m, queensPar)
          if (isQueen && isNotVisited) {
            const key = JSON.stringify([i, j, l, m])
            queensPar.push(key)
            h += 1
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
          const isNotVisited = !contains(i, j, l, m, queensPar)
          if (isQueen && isNotVisited) {
            const key = JSON.stringify([i, j, l, m])
            queensPar.push(key)
            h += 1
          }
          l = l - 1
          m = m - 1
        }

        // Now go down the diagonal
        l = i + 1
        m = j + 1
        while (exists(l, m, board.length)) {
          const isQueen = board[l][m] === true
          const isNotVisited = !contains(i, j, l, m, queensPar)
          if (isQueen && isNotVisited) {
            const key = JSON.stringify([i, j, l, m])
            queensPar.push(key)
            h += 1
          }
          l = l + 1
          m = m + 1
        }
      }
    }
  }

  return h
}

function deepCopy(arr) {
  return arr.map(function (arr) {
    return arr.slice()
  })
}

export function hillClimbing(board) {
  let minH = 999999
  let nextBoard = deepCopy(board)

  if (nSideMoves >= maxInteractions) {
    return -1
  }

  nSteps += 1

  let sidewayMove = false

  for (let i = 0; i < board.length; i++) {
    const queen = board[i].indexOf(true)
    board[i][queen] = false

    for (let k = 0; k < board[0].length; k++) {
      if (k !== queen) {
        board[i][k] = true
        let h = heuristicValue(board)
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
    console.log(`Number of steps required ${nSteps}`)
    console.log(`Number of side moves required ${nSideMoves}`)
    return nextBoard
  }

  return hillClimbing(nextBoard)
}

export function executeHillClimbing(board) {
  nSteps = 0
  nSideMoves = 0
  const finalBoard = hillClimbing(board)

  return { finalBoard, nSteps }
}
