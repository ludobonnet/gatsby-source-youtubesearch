#!/usr/bin/env node
"use strict"

const program = require(`commander`)

const { prompt } = require(`inquirer`)

const { buildAll, storeVideos } = require(`./tools`)

const questions = [
  {
    type: `input`,
    name: `key`,
    message: `Enter api key ...`,
  },
  {
    type: `input`,
    name: `q`,
    message: `Enter term ...`,
  },
  {
    type: `input`,
    name: `channelId`,
    message: `Enter channelId ...`,
  },
]
program.version(`0.1.0`)
program
  .command(`generator`)
  .alias(`g`)
  .description(``)
  .action(() => {
    prompt(questions).then(async answers => {
      storeVideos(answers)
    })
  })
program
  .command(`build <path>`)
  .alias(`b`)
  .description(`Build videos data files`)
  .action(path => {
    buildAll(path)
  })
program.parse(process.argv)
