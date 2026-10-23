import { useEffect, useState } from "react";

const TTL = 60 * 1000;
const cache = new Map();

// Shares one in-flight/recent request between sections that need the same endpoint.
function load(key, fetcher) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.promise;

  const promise = fetcher();
  cache.set(key, { at: Date.now(), promise });
  promise.catch(() => cache.delete(key));
  return promise;
}

export default function useApiData(key, fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true }));

    load(key, fetcher)
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => {
        console.error(`Error fetching ${key}:`, error);
        if (active) setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
