"use strict"

const fs = require(`fs-extra`)

const array = require(`lodash/array`)

const { search } = require(`./youtube`)

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  { searches, apiKey, maxVideos }
) => {
  const { createNode } = actions
  const globalOptions = {
    key: apiKey,
    part: `snippet`,
    order: `date`,
    type: `video`,
    videoEmbeddable: `true`,
  }

  if (maxVideos) {
    globalOptions.maxVideos = maxVideos
  }

  const dir = `./src/data/videos`

  const concatVideos = options =>
    new Promise(async (resolve, reject) => {
      try {
        const file = `${dir}/${options.channelId}.json`
        let oldContent = null
        await fs.ensureFile(file)
        oldContent = await fs.readJson(file, {
          throws: false,
        })
        let content = await search(options)
        let old = 0

        if (oldContent !== null) {
          old = oldContent.length
          content = array.unionBy(content, oldContent, `id`)
        }

        const total = content.length

        if (total >= 1) {
          console.info(`from ${content[0].channelTitle}`)
        }

        console.info(`New: ${total - old}`)
        console.info(`Total: ${total}`)
        resolve(content)
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })

  const processVideo = video => {
    const nodeId = createNodeId(`YoutubeVideo-${video.id}`)
    const nodeContent = JSON.stringify(video)
    const nodeData = Object.assign({}, video, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `YoutubeVideo`,
        content: nodeContent,
        contentDigest: createContentDigest(video),
      },
    })
    return nodeData
  }

  Promise.all(
    searches.map(async options => {
      try {
        const opts = Object.assign({}, globalOptions, options)
        const results = await concatVideos(opts)
        results.map(result => {
          const nodeData = processVideo(result)
          createNode(nodeData)
        })
      } catch (err) {
        console.error(err)
      }
    })
  )
}
