import nextMDX from '@next/mdx';

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: { providerImportSource: '@mdx-js/react' },
});

const rewrites = async () => {
  return [
    {
      source: '/sitemap.xml',
      destination: '/api/sitemap',
    },
  ];
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  }),
  rewrites,
  env: {
    version: process.env.npm_package_version,
    base: process.env.BASE || 'https://cinematt.photography',
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
