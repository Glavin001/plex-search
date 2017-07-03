const parseEpisode = require('episode');
const { Media } = require('./Media');

class PlexSearch {
    constructor(client) {
        this.client = client;
    }

    search(query) {
        const params = this.parse(query);
        // console.log('params', params);
        if (params.isEpisode) {
            return this.searchForShow(params.query, params.season, params.episode);
        } else {
            return this.sendQuery(params.query);
        }
    }

    parse(query) {
        const episodeInfo = parseEpisode(query);
        const { season, episode, matches = [] } = episodeInfo;
        const isEpisode = Boolean(season || episode);
        if (isEpisode) {
            return {
                query: matches.reduce((result, match) => result.split(match).join(''), query).trim(),
                season,
                episode,
                isEpisode: true,
            };
        } else {
            return {
                query,
            };
        }
    }

    sendQuery(query) {
        return this.client.query(`/search?query=${query}`)
            .then(response => this.constructor.getMetadata(response))
            .then(mediadata => mediadata.map(data => new Media(data)))
            ;
    }

    getEpisodes(media) {
        const allLeaves = media.key.replace('children', 'allLeaves');
        return this.client.query(allLeaves);
    }

    searchForShow(showTitle, seasonNum, episodeNum) {
        return this.client.query(`/search?query=${showTitle}&type=${MediaType.Shows}`)
            .then(response => this.constructor.getMetadata(response))
            .then(shows => Promise.all(shows.map(show =>
                this.getEpisodes(show)
                    .then(response => this.constructor.getMetadata(response))
                    .then(mediadata => mediadata.map(data => new Media(data)))
            )))
            .then(shows => {
                if (seasonNum) {
                    return shows.map(show => show.filter(episode =>
                        episode.season === seasonNum
                    ));
                }
                return shows;
            })
            .then(shows => {
                if (episodeNum) {
                    return shows.map(show => show.filter(episode =>
                        episode.episode === episodeNum
                    ));
                }
                return shows;
            })
            .then(shows => [].concat.apply([], shows))
            ;
    }    

    static getMetadata(response) {
        // console.log("response", JSON.stringify(response, null, 2));
        const { MediaContainer = {} } = response;
        const { Metadata = [] } = MediaContainer;
        return Metadata;
    }

}

const MediaType = {
    Movies: 1,
    Shows: 2,
    Episodes: 4,
};

module.exports = {
    PlexSearch,
};