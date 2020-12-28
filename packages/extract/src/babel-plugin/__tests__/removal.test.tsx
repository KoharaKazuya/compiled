import { transformSync } from '@babel/core';
import reactBabelPlugin from '@compiled/babel-plugin';
import extractBabelPlugin from '../index';

const transform = (opts: { runtime: 'automatic' | 'classic' } = { runtime: 'classic' }) => (
  code: TemplateStringsArray
) => {
  return transformSync(code[0], {
    configFile: false,
    babelrc: false,
    presets: [['@babel/preset-react', { runtime: opts.runtime }]],
    plugins: [reactBabelPlugin, extractBabelPlugin],
  })?.code;
};

describe('removal behaviour', () => {
  it('should remove compiled runtime from CSS prop when classic runtime', () => {
    const actual = transform()`
      import '@compiled/react';

      <div css={{ fontSize: 12 }}>hello world</div>
    `;

    expect(actual).toMatchInlineSnapshot(`
      "/* File generated by @compiled/babel-plugin v0.0.0 */

      import * as React from 'react';
      import { ax, ix } from \\"@compiled/react/runtime\\";
      const _ = \\"._1wyb1fwx{font-size:12px}\\";

      /*#__PURE__*/
      React.createElement(\\"div\\", {
        className: ax([\\"_1wyb1fwx\\"])
      }, \\"hello world\\");"
    `);
  });

  xit('should remove CSS declarations', () => {});
});