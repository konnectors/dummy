# Dummy OAuth konnector

This konnector is aimed to make development for OAuth konnectors easier. It uses a dedicated cozy instance as OAuth provider.

Typical usage is :
> From `cozy.localhost:8080`, the Dummy OAuth konnector makes an OAuth connection to `cozy.localhost:8080`.

## Set up

To be used, this konnector needs a little set up. We assume that there is already a CouchDB running, and a cozy stack with an instance `cozy.localhost:8080`.

### Registering OAuth client

For more detail about OAuth workflow in Cozy, see https://docs.cozy.io/en/cozy-stack/auth/

Then we must register our konnector on `cozy.localhost:8080`.

```
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST -d '{"client_name":"Dummy OAuth","software_id":"cozy-konnector-dummy-oauth","redirect_uris":["http://oauthcallback.x.cozy.localhost:8080/accounts/dummy-oauth/redirect"]}' http://cozy.localhost:8080/auth/register
```

We then use the values in the responses to configure our account type in CouchDB. Let's keep `client_id`, `client_secret`

Then, in Fauxton, we create a document called `dummy-oauth` into `secrets/io-cozy-account_types`
database :

```
{
  "_id": "dummy-oauth",
  "grant_mode": "authorization_code",
  "client_id": "<client_id>",
  "client_secret": "<client_secret>",
  "auth_endpoint": "http://cozy.localhost:8080/auth/authorize",
  "redirect_uri": "http://oauthcallback.x.cozy.localhost:8080/accounts/dummy-oauth/redirect"
}
```

### Installing konnector

If the konnector is not yet installed, it can be done with the following command:

```
cozy-stack konnectors install dummy-oauth git://github.com/konnectors/dummy.git#build_oauth --domain cozy.localhost:8080
```

Then the konnector appears in Cozy-Home with all other konnectors. It behaves like any other OAuth konnector; the connection form will just contain a `Connect` button.
