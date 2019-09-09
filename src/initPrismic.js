import Cache from 'creature-cache';
import { PrismicClient } from '@ryanhefner/react-prismic';

let client = null;

function create({
  api,
  cache,
  repo,
}) {
  return new PrismicClient({
    api,
    repo,
    ssrMode: !!(process.browser) === false,
    cache: cache instanceof Cache
      ? cache
      : (new Cache()).restore(cache),
  });
}

export default function initPrismic(initialState = {}) {
  if (!process.browser) {
    return create(initialState);
  }

  if (!client) {
    client = create(initialState);
  }

  return client;
}
