const YoutubeSearch = require(`youtube-search`)

const globalOptions = {
  part: `snippet`,
  order: `date`,
  type: `video`,
  videoEmbeddable: `true`,
}

const search = options =>
  new Promise((resolve, reject) => {
    const opts = Object.assign(globalOptions, options)
    YoutubeSearch(options.q, opts, function(err, results) {
      if (err) return reject(err)

      results.map(result => {
        result.videoId = result.id
        return result
      })
      return resolve(results)
    })
  })

module.exports = { search }
