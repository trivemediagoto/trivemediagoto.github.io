(() => {
  const params = new URLSearchParams(location.search);
  const cutoff = Date.parse('2026-12-26T17:00:00+09:00');
  const requested = params.get('at');
  const simulated = requested && /^2026-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(requested)
    ? Date.parse(requested + '+09:00') : null;
  const target = new URL('single/' + location.search + location.hash, location.href);
  const check = () => {
    const now = simulated === null ? Date.now() : simulated;
    if (params.get('mode') === 'main' || now >= cutoff) {
      location.replace(target.href);
    } else if (simulated === null) {
      setTimeout(check, Math.min(cutoff - now, 86400000));
    }
  };
  check();
})();
