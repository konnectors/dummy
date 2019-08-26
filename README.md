[Cozy][cozy] Dummy
=======================================

What's Cozy?
------------

![Cozy Logo](https://cdn.rawgit.com/cozy/cozy-guidelines/master/templates/cozy_logo_small.svg)

[Cozy] is a platform that brings all your web services in the same private space. With it, your webapps and your devices can share data easily, providing you with a new experience. You can install Cozy on your own hardware where no one's tracking you.

What's Dummy?
--------------------------

Dummy is a konnector used for development, debugging and test purpose. It is used to test error from the connector to the [Home][].

Install
-------

Since `dummy` is only for development purposes, it must not be available in the Cozy store and as such is only published
on GitHub and on the registry in the dev channel. Travis automatically updates thoses branches and the registry when a
change lands on master.

### Flavors

- `build`: Dummy connector
- `build_aggregator`: Used to test the aggregator account feature used in Banking konnectors
- `build_form`
- `build_oauth`
- `build_twofa`: Used to test 2FA flow for example for the [Amazon](https://github.com/konnectors/amazon) connector

Each of this flavor is published on a build branch, for example [here](https://github.com/konnectors/dummy/tree/build_twofa)

Additionally, the 2FA flavor is published in the registry at `registry://dummy/dev`.

```bash
cozy-stack konnectors install dummy registry://dummy/dev
```

[cozy]: https://cozy.io "Cozy Cloud"
[Home]: https://github.com/cozy/cozy-home
