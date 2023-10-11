## Photowebsite - clone of Cinematt - personal photography website
Background from Matt at:  https://mattfinucane.com/projects/cinematt-nextjs/

pr.new [https://pr.new] and stackblitz [https://stackblitz.com/] is being used to spin this environment up in a browswer. 

1.  pr.new and create a stackblitz account connecting it to your github account
2.  open the github project.  In this case at: [https://github.com/dalecope/photowebsite]
3.  add "pr.new"[https://PR.NEW/github.com/dalecope/photowebsite]

... 

### Set up
You will need:
- the latest stable version of [NodeJS](https://nodejs.org/en/)
- a command line with Git installed. Linux and MacOS users should already have this. Windows users should check out [https://docs.microsoft.com/en-us/windows/wsl/about] which is what is needed to run most of the tools for this project.
- (optional) [Docker] if you want to run production-like builds locally.
- (optional) A local SSL certificate so you can run https locally. Follow this [excellent guide](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/).

1) Check this project out to your local machine with `$ git clone https://github.com/matfin/cinematt-nextjs.git`.
2) Install dependencies with `$ yarn`.
3) To run in local development mode - `$ yarn dev`.
4) To build the project - `$ yarn build`.
5) To export the project statically `$ yarn export` which will dump everything into a directory called `out/`. You could use a webserver like [Nginx](https://www.nginx.com/) to serve this content.
6) To run the local Docker build, make sure Docker is installed and running and then run:
  - `$ docker-compose build`.
	- `$ docker-compose up` if you want to see logs on the console.
	- `$ docker-compose up -d` if you want silent output.

### How is this deployed
To deploy this to the production server, a combination of Docker Compose and [CircleCI](https://circleci.com/) is used as follows:
- There are two containers tied together in the [Docker Compose file](docker-compose.yml)
  - The NodeJS container is responsible for using NextJS to build the static content for the site. This stops when the build is complete.
	- The Nginx container is responsible for serving this static content over https.
- Both the above containers share the same volume, so the Nginx container can consume the output generatd by the NodeJS container.
- When code is pushed to a branch other than 'main', all the checks are run (with CircleCI) for things such as unit tests and code quality checks.
- When a pull request is merged to the 'main' branch, the deployment process kicks off as follows:
  - The project is checked out and then built with Docker Compose.
	- The built images (cinematt-build, cinematt-serve) are then pushed to a public Docker Hub repository.
	- The deployment process kicks off, whereupon the docker compose and docker files are copied to the remote server.
	- An SSH connection is then made to the remote server (running Docker) and the latest images are pulled down.
	- The existing running containers (based on the images) are stopped and removed.
	- The new containers are started up.

### Roadmap
I have a [tech roadmap](ROADMAP.md) of things I need to do with this project too.