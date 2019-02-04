"use strict"

exports.__esModule = true
exports.default = void 0

const YoutubeSearch = require(`youtube-search`)

class Youtube {
  constructor(params) {
    this.options = {
      key: apiKey,
      part: `snippet`,
      order: `date`,
      type: `video`,
      videoEmbeddable: `true`,
    }
  }

  getVideoId(url) {
    let ID = ``
    url = url
      .replace(/(>|<)/gi, ``)
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)

    if (url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i)
      ID = ID[0]
    }

    return ID
  }

  search(options) {
    const opts = Object.assign(this.options, options)
    YoutubeSearch(``, opts, function(err, results) {
      if (err) return reject(err)
      results.forEach(result => {
        result.videoId = getVideoId(result.link)
        return result
      })
    })
  }
}

var _default = Youtube
exports.default = _default
