import axios from 'axios';
import { buildPodcastRequestUrl } from '../../../helpers/urls';

export const FETCH_SUBSCRIPTIONS_REQUEST = 'FETCH_SUBSCRIPTIONS_REQUEST';
export const FETCH_SUBSCRIPTIONS_SUCCESS = 'FETCH_EPISODE_SUCCESS';
export const FETCH_SUBSCRIPTIONS_FAILURE = 'FETCH_SUBSCRIPTIONS_FAILURE';

export function fetchSubscriptionsRequest() {
  return { type: FETCH_SUBSCRIPTIONS_REQUEST, isFetching: true };
}

export function fetchSubscriptionsSuccess(subscriptions) {
  return {
    type: FETCH_SUBSCRIPTIONS_SUCCESS,
    isFetching: false,
    subscriptions
  };
}

export function fetchSubscriptionsFailure(error) {
  return { type: FETCH_SUBSCRIPTIONS_FAILURE, isFetching: false, error };
}

export function fetchSubscriptions(subscriptions) {
  return dispatch => {
    dispatch(fetchSubscriptionsRequest());

    const promises = [];

    for (let i = 0; i < subscriptions.length; i += 1) {
      promises.push(
        axios.get(buildPodcastRequestUrl(subscriptions[i]), { timeout: '10s' })
      );
    }
    return Promise.all(promises)
      .then(res => {
        dispatch(fetchSubscriptionsSuccess(res.map(item => item.data)));
      })
      .catch(error => {
        if (!error.response) {
          dispatch(fetchSubscriptionsFailure('Error connecting to the server'));
        } else {
          dispatch(fetchSubscriptionsFailure(error.response.data.message));
        }
      });
  };
}
