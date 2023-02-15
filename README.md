# icam

*Index Conventionum Aevorum Mediorum - A Compendium for Medieval Conferences*

By [David J. Thomas](mailto:dave.a.base@gmail.com), [thePort.us](https://thePort.us) and [Matt King](mailto:matthewking1@usf.edu)

---

Check out the live project website at [https://icam.theport.us/](https://icam.theport.us/)

---

Full Stack (MySQL ExpressJS Angular NodeJS) app for browsing the proceedings of conferences in Medieval Studies.

---

## Installation

Current installation is on a Docker setup.


Install docker, and docker-compose locally. Then clone this repo and move inside the directory. Finally, fetch the submodule, which contains the seeder data.

``` sh
git clone https://github.com/thePortus/icam-server.git
cd icam-server
git submodule update --init --recursive
```

Thenm, modify the following files with your desired accounts/passwords/ports

``` sh
# most crucial, for setting account passwords
/docker-compose.yml
# you must change the server_name and redirect to have the url to which you are deploying
/nginx/nginx.conf
```

Now, launch the docker containers with `docker compose up -d`.

The run command in our `docker-compose.yml` should have gotten the SSL certifictes for us already.

After docker is up... use `docker exec` to shell into the server container...

``` sh
# run to get list of docker container names, look for server
docker ps
# shell into the server container
docker exec -it SERVER_CONTAINER_NAME sh
# run the server seeders
source migrate
# exit out of container shell
exit
```

Now, set the certbot to autorenew.

``` sh
docker compose run --rm certbot renew
```

Then, stop the webserver, and output the dhparam key

``` sh
docker compose stop webserver
sudo openssl dhparam -out /home/YOUR_USERNAME/icam-server/dhparam/dhparam-2048.pem 2048
```

Finally, modify the `nginx/nginx.conf` file and uncomment the lower server block. MAKE SURE to replace values with your domains. Then restart the server with `docker compose restart`.

That's it, the server should be up an running.
