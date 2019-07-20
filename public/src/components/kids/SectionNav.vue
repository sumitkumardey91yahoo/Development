<template>
    <nav class="top-menu">
        <a class="kids-menu" v-for="section in kidsSectionNavs" :class="activeSectionClass(section)" @click="getSectionContents(section)">{{section.titles.default}}</a>
    </nav>
</template>

<script>
import { eventBus } from '../../main';
import { altMixins } from '../../mixins';
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    data() {
        return {
            param: undefined,
            withUrl: false,
            limit: 10,
            theKidsContents: undefined,
            totalCount: undefined,
            itemsCount: undefined,
        };
    },
    computed: {
        ...mapGetters([
            'appActive',
            'kidsSectionId',
            'page',
            'offset',
            'kidsContents',
            'kidsSectionNavs',
            'kidsActiveSectionTitle',
        ]),
    },
    watch: {
        appActive() {
            this.initKidsMode();
        }
    },
    methods: {
        ...mapMutations([
            'setKidsSectionNavs',
            'setKidsActiveSectionTitle',
            'setPage',
            'setOffset',
            'setKidsContents',
        ]),
        ...mapActions([
            'actGetSections',
            'actGetContentsByUrl',
            'actGetContentsById',
            'actGetKidsContentsByUrl',
        ]),
        initKidsMode() {
            this.getSections();
        },
        getSections() {
            // console.log('[SectionNav | getSections | ]');

            this.actGetSections(this.kidsSectionId).then((response) => {
                // console.log('[SectionNav | getSections | response ]', response);
                if (response && response.length) {
                    /**
                    * setting the kids section navs
                    * [mutation | home.js]
                    */
                    this.setKidsSectionNavs(response);

                    var firstSection = response[0];
                    /**
                    * setting the active navigation styles
                    * [mutation | home.js]
                    */
                    this.setKidsActiveSectionTitle(firstSection.titles.default);

                    /**
                    * process the first section
                    */
                    if (firstSection.external_id) {
                        this.param = firstSection.external_id;
                        this.withUrl = true;
                    } else {
                        this.param = firstSection.id;
                        this.withUrl = false;
                    }
                    /**
                    * set the page number
                    */
                    this.setPage(1);
                    /**
                    * set the offset
                    */
                    this.setOffset(0);
                    /**
                    * get the contents
                    */
                    this.getContents();
                }
            }, (error) => {
                // console.log(error);
            });
        },
        getContents() {
            // console.log('[Kids | getContents | ]');
            // console.log('[Kids | getContents | page | ]', this.page);
            // console.log('[Kids | getContents | offset | ]', this.offset);
            // console.log('[Kids | getContents | limit | ]', this.limit);
            // console.log('[Kids | getContents | param | ]', this.param);
            // console.log('[Kids | getContents | withUrl | ]', this.withUrl);

            if (this.withUrl) {
                this.actGetKidsContentsByUrl({
                    url: this.param,
                    limit: this.limit,
                    offset: this.offset
                }).then((response) => {
                    // console.log('[actGetKidsContentsByUrl | response | ]', response);

                    this.totalCount = response.count;
                    this.processKidsContents(response);
                }, (error) => {
                    // console.log('[actGetKidsContentsByUrl | error | ]', error);

                    if (error.code == 401) {
                        localStorage.removeItem('altKidsUser');
                        localStorage.setItem('altProfileMode', 'default');
                        this.$router.push({ name: 'home' });
                    }
                });
            } else {
                this.actGetContentsById({
                    id: this.param,
                    limit: this.limit,
                    offset: this.offset
                }).then(
                    (response) => {
                        // console.log('[Kids | getContents | actGetContentsById | response | ]', response);

                        this.totalCount = response.elements.count;
                        this.processKidsContents(response);
                    },
                    (error) => {
                        // console.log('[Kids | getContents | actGetContentsById | error | ]', error);

                        if (error.code == 401) {
                            localStorage.removeItem('altKidsUser');
                            localStorage.setItem('altProfileMode', 'default');
                            this.$router.push({ name: 'home' });
                        }
                    }
                )
            }
        },
        processKidsContents(response) {
            // console.log('[Kids | processKidsContents | response | ]', response);

            var parsedContents = new Array();
            var responseObj = undefined;

            // console.log('[processKidsContents | kidsContents | ]', this.kidsContents);
            this.theKidsContents = this.theKidsContents ? this.theKidsContents : new Array();

            if (response.history && response.history.length) {
                responseObj = response.history;

                // console.log('[processKidsContents | responseObj | ]', responseObj);

                var mediaProgressList = new Array();
                for (var i in responseObj) {
                    var length = (responseObj[i].media.details && responseObj[i].media.details.length) ? responseObj[i].media.details.length : undefined;
                    var progress = undefined;
                    if (length && responseObj[i].playback_progress) {
                        progress = Math.round((responseObj[i].playback_progress / length) * 100);
                    }
                    var mediaId = responseObj[i].media.id;
                    mediaProgressList.push({ mediaId, progress, length });

                    var parsedElement = this.parseContents(responseObj[i].media);
                    if (responseObj[i].playback_progress) {
                        parsedElement.progress = (responseObj[i].playback_progress / parsedElement.durationInSec) * 100;
                    }

                    // console.log('[processKidsContents | parsedElement | ]', parsedElement);

                    this.theKidsContents.push(parsedElement);
                }

                // console.log('[SectionNav | processKidsContents | kidsContents | ]', this.theKidsContents);

                localStorage.setItem('mediaProgressList', JSON.stringify(mediaProgressList));
            } else if (response.elements) {
                // console.log('[processKidsContents | typeof theKidsContents | ]', typeof(this.theKidsContents));

                if (response.elements.series && response.elements.series.length) {
                    responseObj = response.elements.series;
                    for (var i in responseObj) {
                        this.theKidsContents.push(this.parseContents(responseObj[i]));
                    }
                }
            }

            // console.log('[Kids | processKidsContents | theKidsContents | ]', this.theKidsContents);

            if (this.theKidsContents && this.theKidsContents.length) {
                var filterContents = this.theKidsContents.filter((content) => {
                    return content.kidsContent;
                });

                // console.log('[Kids | processKidsContents | filterContents | ]', filterContents);

                if (filterContents && filterContents.length) {
                    this.itemsCount = filterContents.length;
                    this.setKidsContents(filterContents);

                    // console.log('[SectionNav | processKidsContents | totalCount | ]', this.totalCount);
                    // console.log('[SectionNav | processKidsContents | itemsCount | ]', this.itemsCount);

                    if (this.totalCount <= this.itemsCount) {
                        eventBus.$emit('toggleLoadMoreBtn', false);
                    } else {
                        eventBus.$emit('toggleLoadMoreBtn', true);
                    }

                    this.toggleLoader(false);
                } else {
                    this.setKidsContents(undefined);

                    var emptySectionIndex = this.kidsSectionNavs.findIndex((nav) => {
                        return nav.titles.default == this.kidsActiveSectionTitle;
                    });

                    // console.log('[Kids | getContents | emptySectionIndex | ]', emptySectionIndex);

                    this.getSectionContents(this.kidsSectionNavs[emptySectionIndex + 1]);
                    this.kidsSectionNavs.splice(emptySectionIndex, 1);
                    this.setKidsSectionNavs(this.kidsSectionNavs);
                }
                // console.log('[Kids | getContents | kidsContents | ]', this.kidsContents);
            } else {
                this.setKidsContents(undefined);

                var emptySectionIndex = this.kidsSectionNavs.findIndex((nav) => {
                    return nav.titles.default == this.kidsActiveSectionTitle;
                });

                // console.log('[Kids | getContents | emptySectionIndex | ]', emptySectionIndex);

                this.getSectionContents(this.kidsSectionNavs[emptySectionIndex + 1]);
                this.kidsSectionNavs.splice(emptySectionIndex, 1);
                this.setKidsSectionNavs(this.kidsSectionNavs);
            }

        },
        activeSectionClass(section) {
            return (this.kidsActiveSectionTitle == section.titles.default) ? 'active' : '';
        },
        getSectionContents(section) {
            // console.log('[SectionNav | getSectionContents | section | ]', section);

            this.toggleLoader(true);
            this.theKidsContents = undefined;
            // console.log('[SectionNav | toggleLoader | loader toggled | ]');
            this.setKidsActiveSectionTitle(section.titles.default);
            if (section.external_id) {
                this.param = section.external_id;
                this.withUrl = true;
            } else {
                this.param = section.id;
                this.withUrl = false;
            }
            /**
            * set the page number
            */
            this.setPage(1);
            /**
            * set the offset
            */
            this.setOffset(0);
            /**
             * get the contents
             */
            this.getContents();
        },
        loadMoreContentsCB() {
            this.setOffset(this.offset + this.limit);
            // console.log('[SectionNav | loadMoreContentsCB | limit | ]', this.limit);
            // console.log('[SectionNav | loadMoreContentsCB | offset | ]', this.offset);
            this.getContents();
        },
    },
    created() {
        if (this.appActive && this.kidsSectionId) {
            // console.log('[Kids | created | ]');
            this.initKidsMode();
        }

        eventBus.$on('loadMoreKidsContentsEvent', this.loadMoreContentsCB)
    },
    mixins: [altMixins]
}
</script>
