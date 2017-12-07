## Installation

### Prerequisites
- docker

### Installation

First, you will need a postgres database. Only then, you can run the project.

#### Database

Just run:

```
docker run -d -p 5432:5432 --name appcamps-postgres-new postgres
```

This runs a postgres database in docker and exposes the port `5432`. This allows you to access and manage the database using a client tool.

The docker container name should be kept untouched, because that's the one defined in the project's run script for linking the project to this database.

#### Project

If you didn't build an image yet, you will need to do it (from the project's root folder):

```
docker build -t local/appcamps-teach .
```

This image doesn't need to be built on project changes. This is because when we run the container, it will mount a volume with your project folder and use always the current files.


Then, you can run (from the project's root folder):

```
./run-dev.sh
```

The project will be accessible through the port 80:

```
http://<docker-container-ip>/
```

where `<docker-container-ip>` is the ip of the container running the project (`localhost` if you are running Linux).

Since the container is using a mounted volume to access your files, you don't need to restart the container when you change a file. It will watch your changes and update in real-time.


#### Database data

If it's the first time you are doing this, you will need to seed your database with data. If you have a dump file with `.gz` extension, you just need to:

```
cat dbdump.gz | gunzip | psql -h <docker-container-ip> -U postgres appcamps_development
```

where `<docker-container-ip>` is the ip of the container running the postgres database (`localhost` if you are running Linux).
