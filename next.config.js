/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/city/:slug',
                destination: '/:slug',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
