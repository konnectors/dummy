# Dummy OAuth konnector

This konnector is aimed to make development for OAuth konnectors easier. It uses a dedicated cozy instance as OAuth provider.

Typical usage is :
> From `cozy.tools:8080`, the Dummy OAuth konnctor make an OAuth connection to `cozy.local:8080`.

## Set up

To be used, this konnector needs a little set up. We assume that there is already a CouchDB running, and a cozy stack with an instance `cozy.tools:8080`.

### Dedicated instance

To avoid authentication conflicts with cookies, we name our new instance `cozy.local:8080`. It means that we need to map the domain `cozy.local` to our local host. In `/etc/hosts`, just add this line:

```
127.0.0.1    cozy.local
```

Then create the new instance

```
cozy-stack instances add --dev --passphrase cozy cozy.local:8080
```

### Registering OAuth client

For more detail about OAuth workflow in Cozy, see https://docs.cozy.io/en/cozy-stack/auth/

Then we must register our konnector on `cozy.local:8080`.

```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"client_name":"Dummy OAuth","software_id":"cozy-konnector-dummy-oauth","redirect_uris":["http://cozy.tools:8080/accounts/dummy-oauth/redirect"]}' http://cozy.local:8080/auth/register
```

We then use the values in the responses to configure our account type in CouchDB. Let's keep `client_id`, `client_secret`

First let's ensure that the `secret` database exists.
```
curl -X PUT localhost:5984/secrets%2Fio-cozy-account_types
```

Then let's create a document for the account type `dummy-oauth`.

```
curl -X PUT localhost:5984/secrets%2Fio-cozy-account_types/dummy-oauth \
-d '{"grant_mode": "authorization_code","client_id": "<CLIENT_ID>","client_secret":"<CLIENT_SECRET>","auth_endpoint": "http://cozy.local:8080/auth/authorize"}'
```

### Installing konnector

If the konnector is not yet installed, it can be done with the following command:

```
cozy-stack konnectors install dummy-oauth git://github.com/konnectors/dummy.git#build_oauth --domain cozy.tools:8080
```

Then the konnector appears in Cozy-Home with all other konnectors. It behaves like any other OAuth konnector; the connection form will just contain a `Connect` button.
