class Media {

    constructor(rawData) {
        this.rawData = rawData;
    }

    get title() {
        return this.rawData.title;
    }

    get type() {
        return this.rawData.type;
    }

    get year() {
        return this.rawData.year;
    }

    get key() {
        return this.rawData.key;
    }

    get id() {
        return this.key.split('/')[3];
    }

    get summary() {
        return this.rawData.summary;
    }

    get isShow() {
        return this.type === "show";
    }

    get isEpisode() {
        return this.type === "episode";
    }

    get isMovie() {
        return this.type === "movie";
    }

    get season() {
        if (this.isEpisode) {
            return this.rawData.parentIndex;
        }
    }

    get episode() {
        if (this.isEpisode) {
            return this.rawData.index;
        }
    }

    get showTitle() {
        if (this.isEpisode) {
            return this.rawData.grandparentTitle;
        }
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            type: this.type,
            year: this.year,
            key: this.key,
            summary: this.summary,
            season: this.season,
            episode: this.episode,
            showTitle: this.showTitle,
        };
    }
}

module.exports = {
    Media
};