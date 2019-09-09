import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { getDataFromTree } from 'next-utils';
import { getDisplayName } from 'react-hoc-helpers';
import { PrismicProvider } from '@ryanhefner/react-prismic';

import initPrismic from './initPrismic';

const Flatted = require('flatted/cjs');

export default (config) => {
  const { api, cache, client, repo } = config || {};

  return (ComposedComponent) => {
    const propTypes = {
      prismicState: PropTypes.shape(),
    };

    const defaultProps = {
      prismicState: null,
    };

    const Prismic = class extends React.Component {
      static displayName = `withPrismic(${getDisplayName(ComposedComponent)})`;

      constructor(props) {
        super(props);

        this.prismicClient = initPrismic(props.prismicState);
      }

      static async getInitialProps(props) {
        const { Component, router, ctx } = props;

        let composedInitialProps = {};
        if (ComposedComponent.getInitialProps) {
          composedInitialProps = await ComposedComponent.getInitialProps(props);
        }

        // Run all Prismic queries in the component tree
        // and extract the resulting data
        const prismicClient = initPrismic({
          api,
          repo,
        });

        if (!process.browser) {
          const { req } = ctx;

          try {
            // Run all Prismic queries
            await getDataFromTree(
              <PrismicProvider client={prismicClient}>
                <ComposedComponent
                  Component={Component}
                  ctx={ctx}
                  router={router}
                  store={ctx.store}
                  {...composedInitialProps}
                />
              </PrismicProvider>
            );
          } catch (error) {
            // Prevent errors from crashing SSR.
            // Handle them in components via the data.error prop:
            if (process.env.NODE_ENV === 'development') {
              console.log(error);
            }
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }

        const cache = prismicClient.cache.extract();

        // Pass in the initial cache state
        const prismicState = {
          cache: Flatted.stringify(cache),
          repo,
        };

        return {
          ...composedInitialProps,
          prismicState,
        };
      }

      render() {
        return (
          <PrismicProvider
            {...this.props.prismicState}
            client={this.prismicClient}
          >
            <ComposedComponent {...this.props} />
          </PrismicProvider>
        );
      }
    };

    Prismic.propTypes = propTypes;
    Prismic.defaultProps = defaultProps;

    return Prismic;
  };
}
