const trackJsConfig = {
  token: 'c5bcf84e3d6745b2840982494a5005b3',
  application: process.env.TRACKJS_APPLICATION || 'development',
  version: process.env.VERSION,
  network: { error: false },
  console: { display: false },
};
if (process.env.NODE_ENV !== 'production') {
  trackJsConfig.enabled = false;
}

export default trackJsConfig;
