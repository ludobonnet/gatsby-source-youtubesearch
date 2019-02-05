"use strict"

const fs = require(`fs-extra`)

const array = require(`lodash/array`)

const chalk = require(`chalk`)

const { search } = require(`./youtube`)

const dir = `./src/data/videos`
const key = process.env.GOOGLE_API_KEY

async function storeVideos(options) {
  const file = `${dir}/${options.channelId}.json`
  let oldContent = null

  try {
    await fs.ensureFile(file)
    oldContent = await fs.readJson(file, {
      throws: false,
    })
  } catch (err) {
    console.error(err)
  }

  try {
    let content = await search(options)
    let old = 0

    if (oldContent !== null) {
      old = oldContent.length
      content = array.unionBy(content, oldContent, `id`)
    }

    const total = content.length
    await fs.outputJson(file, content, {
      spaces: 2,
    })

    if (total >= 1) {
      console.info(
        chalk.bgBlue.white(`from `, chalk.bold(content[0].channelTitle))
      )
    }

    console.info(`New: ${total - old}`)
    console.info(`Total: ${total}`)
  } catch (err) {
    console.error(err)
  }
}

async function buildAll(path) {
  process.chdir(path)

  const siteConfig = require(`${process.cwd()}/src/utils/siteConfig.js`)

  siteConfig.youtube.searches.map(query => {
    query.key = key
    storeVideos(query)
  })
}

module.exports = {
  buildAll,
  storeVideos,
}
