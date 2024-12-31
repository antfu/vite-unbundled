# vite-unbundled

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Derivated Vite with unbundled dependencies. For debug only.

## Usage

Add `resolutions` to your `package.json`:

```json
{
  "resolutions": {
    "vite": "npm:vite-unbundled@6.0.6"
  }
}
```

Change `6.0.6` to the version you want to use.

## TODOs

- [ ] Release on CI with provance
- [ ] Automate release trigger by Vite release
- [ ] Strictly align with Vite release tag

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2024-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vite-unbundled?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vite-unbundled
[npm-downloads-src]: https://img.shields.io/npm/dm/vite-unbundled?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vite-unbundled
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vite-unbundled?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vite-unbundled
[license-src]: https://img.shields.io/github/license/antfu/vite-unbundled.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/antfu/vite-unbundled/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vite-unbundled
