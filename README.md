# next-prismic

[![npm version](https://badge.fury.io/js/next-prismic.svg)](https://badge.fury.io/js/next-prismic)
[![npm](https://img.shields.io/npm/l/express.svg)](LICENSE)

React library for integrating [`@ryanhefner/react-prismic`](https://npmjs.com/package/@ryanhefner/react-prismic)
into the server-side rendering of your [Next.js](https://nextjs.org) app.

## Install

Via [npm](https://npmjs.com/package/@ryanhefner/next-prismic)

```sh
npm install --save @ryanhefner/next-prismic
```

Via [Yarn](https://yarn.fyi/@ryanhefner/next-prismic)

```sh
yarn add @ryanhefner/next-prismic
```

## How to use

To use `next-prismic`, just set the parameters that will be used by the
`PrismicClient` from [`react-prismic`](https://github.com/ryanhefner/react-prismic)
and wraps your Next.js app in a `PrismicProvider` and handles initiating both
the `PrismicClient` for both SSR/requests and the browser client.

Any `PrismicQuery` instance that appear in your React tree will be queued and requested
server-side and included in the initial state to make reduce the requests being
made by the client and results in your Next/React app rendering faster client-side.

Here’s an example of how it is used:

```js
import App, { Container } from 'next/app';
import React from 'react';
import { withPrismic } from 'next-prismic';

// Prismic config properties
// This is name that is before `.prismic.io` when you are looking at your repo
// in Prismic. (ex. `your-repo.prismic.io`, the `repo` would be `your-repo`)
const repo = '[PRISMIC REPO PREFIX]';

class MyApp extends App {
  static async getInitialProps({ Component, ctx, router }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }

    return { pageProps };
  }

  render() {
    const {
      Component,
      pageProps,
      store,
    } = this.props;

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default withPrismic({
  repo,
})(MyApp);

```

### `withPrismic`

Higher-order component that takes the options provided, wraps your app within
a `PrimicProvider` (from [`react-prismic`](https://github.com/ryanhefner/react-prismic))
and performs the necessary server-side rendering logic to deliver your React
app with all your Prismic data pre-requested/compiled into it.

#### Options

* `repo: string` - The name of the Prismic repo you plan on querying.

> This is name that is before `.prismic.io` when you are looking at your repo in Prismic.

> `repo` should be good for 94.6% of instances when using this class. If you want
> to get fancy, the following `props` are also available for you.

* `api: PrismicApi` - If you’re already initialzing an instance of the Prismic API outside of the `PrismicProvider`, you can pass that in to keep using that same one.

> If you have a reason to override the Prismic API witth your own logic, like
> hitting your own custom endpoint, it should be assumed that your instance of
> the Prismic API matches the interface of the original.

* `client: PrismicClient` - Client that will be used to make requests against Prismic.

* `cache: Cache | iterable | string` - Cache instance to initialize the `client` cache with.

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
