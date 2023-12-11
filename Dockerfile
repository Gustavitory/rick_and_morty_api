FROM node:19 As development
RUN apt-get update && \
    apt-get install -y git && \
    apt-get install -y git-flow
RUN mkdir -p /home/rick_and_morty_server
WORKDIR /home/rick_and_morty_server