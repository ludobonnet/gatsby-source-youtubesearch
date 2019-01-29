const search = require('youtube-search')

exports.sourceNodes = (
  { actions, createNodeId, createContentDigest },
  {channelsIds, apiKey, maxVideos}
) => {
  const { createNode } = actions

  const opts = {
    maxResults: maxVideos,
    key:apiKey,
    part:"snippet",
    order:"date",
    type: "video",
    videoEmbeddable: "true"
  };

  const getVideoId = (url) => {
    let ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    return ID;
  }

  const processVideo = video => {   
    video.videoId = getVideoId(video.link)
    const nodeId = createNodeId(`youtube-video-${video.id}`)
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

  const searchVideos = opts => {
    return new Promise((resolve, reject) => { 
      search('', opts, function(err, results) {
        if(err) return reject(err)
        
        results.forEach(result => {
          const nodeData = processVideo(result)         
          createNode(nodeData)
        });
  
        resolve()
      })
    });
  }

  return Promise.all(channelsIds.map(channelId => {
      opts.channelId=channelId
      return searchVideos(opts) 
      })
    )
}