# url-shortener

## Configuration and run

Use the `docker-compose.yml` as template

You must provide these environment variables

- **API_ENDPOINT**: Your server host `http://server.com`
- **FIREBASE_SERVICE_ACCOUNT**: A json with the credentials found in your firebase service account page
- **FIREBASE_DATABASE_URL**: Your firebase database url
- **API_TOKEN**: A custom token if your like to protect urls generation

Then run `docker-compose up -d`

## Usage

### Generate a url

`curl -X POST http://server.com -H "Content-Type:application/json" --data '{"url":"https://google.com", "token": "custom-token-if-required"}'`

Response

`{"id":"joq5kd7qo7","url":"http://server.com/joq5kd7qo7"}`
