/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import App, { produceNextGenerationGrid, createGeneration, getInitialGrid } from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

it('it should create custom sized grid', () => {
  const grid = getInitialGrid(50)
  expect(grid).toBeInstanceOf(Array)
  expect(grid.length).toBe(50)
  expect(grid[0].length).toBe(50)
})

it('it should produce an array with valid rules', () => {
  expect(produceNextGenerationGrid([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ])).toStrictEqual([
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ])
})

it('should invoke setTimeout', () => {
  jest.useFakeTimers()

  const handle = jest.fn().mockImplementation((func) => func([
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ]))

  createGeneration(handle)

  expect(setTimeout).toHaveBeenCalledTimes(1)
  expect(handle).toHaveBeenCalledTimes(1)
})
