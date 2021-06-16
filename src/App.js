// @flow
import * as React from 'react'
import produce from 'immer'
import './styles.css'

const operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]

type GridType = Array<Array<number>>

export const produceNextGenerationGrid: GridType => GridType = (grid: GridType) => produce(grid, (gridCopy) => {
  const l = gridCopy.length
  for (let n = 0; n <= l - 1; n++) {
    for (let m = 0; m <= l - 1; m++) {
      let neighbors = 0
      operations.forEach(([x, y]) => {
        const newN = n + x
        const newM = m + y
        if (
          newN >= 0 &&
          newN < l &&
          newM >= 0 &&
          newM < l
        ) {
          neighbors += grid[newN][newM]
        }
      })

      if (neighbors < 2 || neighbors > 3) {
        // underpopulation or overcrowding
        gridCopy[n][m] = 0
      } else if (grid[n][m] === 0 && neighbors === 3) {
        // becomes alive
        gridCopy[n][m] = 1
      }
    }
  }
})

export const createGeneration = (handle: any): void => {
  handle(produceNextGenerationGrid)
  setTimeout(() => createGeneration(handle), 16)
}

const defaultGridSize: number = Math.floor(window.innerWidth / 16 - 1)

export const getInitialGrid = (size: number = defaultGridSize): GridType => {
  const seed = Math.random() * size ** 2
  const grid: GridType = new Array(size).fill(null).map(() => new Array(size).fill(0))

  // fill grid randomly based on seed
  for (let i = 0; i <= seed; i++) {
    grid[Math.floor(Math.random() * (size - 1 || 0))][
      Math.floor(Math.random() * (size - 1 || 0))
    ] = 1
  }

  return grid
}

const App: React.StatelessFunctionalComponent<{}> = () => {
  const [grid, setGrid] = React.useState<GridType>(() => getInitialGrid(50))
  const _createGeneration = React.useCallback(() => createGeneration(setGrid), [])

  const onClickReset = React.useCallback(() => {
    setGrid(() => getInitialGrid(50))
    _createGeneration()
  }, [])

  React.useEffect(() => _createGeneration(), [])

  return (
    <div className='App'>
      <h1>
        Game Of Life Sandbox
        <button onClick={onClickReset}>Reset</button>
      </h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.length}, 20px)`
      }}
      >
        {grid.map((row, idx) => (
          row.map((v, index) => (
            <div className={`cell ${grid[idx][index] ? 'active' : 'dead'}`} key={idx + 'x' + index} />
          ))
        ))}
      </div>
    </div>
  )
}

export default App
