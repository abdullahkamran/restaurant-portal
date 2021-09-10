module.exports = {
    async redirects() {
      return [
        {
          source: '/portal',
          destination: '/portal/login',
          permanent: true,
        },
      ]
    },
  }