import axios from 'axios';
import { buildPodcastRequestUrl } from '../../../helpers/urls';

export const FETCH_FEED_REQUEST = 'FETCH_FEED_REQUEST';
export const FETCH_FEED_SUCCESS = 'FETCH_FEED_SUCCESS';
export const FETCH_FEED_FAILURE = 'FETCH_FEED_FAILURE';

export function fetchFeedRequest() {
  return { type: FETCH_FEED_REQUEST, isFetching: true };
}

export function fetchFeedSuccess(feed) {
  return { type: FETCH_FEED_SUCCESS, isFetching: false, feed };
}

export function fetchFeedFailure(error) {
  return { type: FETCH_FEED_FAILURE, isFetching: false, error };
}

export function sortEpisodesByDate(episodeA, episodeB) {
  if (episodeA.date < episodeB.date) return 1;
  if (episodeA.date > episodeB.date) return -1;
  return 0;
}

export function fetchFeed(urlList) {
  return dispatch => {
    dispatch(fetchFeedRequest());
    const promises = [];
    for (let i = 0; i < urlList.length; i += 1) {
      promises.push(
        axios.get(buildPodcastRequestUrl(urlList[i]), { timeout: '10s' })
      );
    }
    Promise.all(promises)
      .then(res => {
        const episodes = res
          .flatMap(item => item.data.episodes)
          .map(item => {
            return { ...item, date: new Date(item.date) };
          })
          .sort((episodeA, episodeB) => sortEpisodesByDate(episodeA, episodeB));
        if (episodes && episodes.length > 0) {
          dispatch(fetchFeedSuccess(episodes));
        } else {
          dispatch(fetchFeedFailure('Feed is empty'));
        }
      })
      .catch(error => {
        if (!error.response) {
          dispatch(fetchFeedFailure('Error connecting to the server'));
        } else {
          dispatch(fetchFeedFailure(error.response.data.message));
        }
      });
  };
}
