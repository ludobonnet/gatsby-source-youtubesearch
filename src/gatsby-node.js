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

  return Promise.all(
    searches.map(async options => {
      const opts = Object.assign(globalOptions, options)
      const results = await search(opts)

      return results.map(result => {
        const nodeData = processVideo(result)
        return createNode(nodeData)
      })
    })
  )
}
