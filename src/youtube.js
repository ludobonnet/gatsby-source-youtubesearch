const YoutubeSearch = require(`youtube-search`)

const globalOptions = {
  part: `snippet`,
  order: `date`,
  type: `video`,
  videoEmbeddable: `true`,
}

const search = options => new Promise((resolve, reject) => {
    const opts = Object.assign(globalOptions, options)
    YoutubeSearch(options.q, opts, function(err, results) {
      if (err) return reject(err)

      results.forEach(result => {
        result.videoId = result.id
        return result
      })
      resolve(results)
    })
  })

module.exports = { search }
