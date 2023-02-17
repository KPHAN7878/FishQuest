#!/bin/bash

while [ True ]; do
if [ "$1" = "--version" -o "$1" = "-v" ]; then
    VERSION=$2
    shift 2
elif [ "$1" = "--key" -o "$1" = "-k" ]; then
    KEY=$2
    shift 2
else
    break
fi
done

if [ "$KEY" =  "" ]; then
  echo "SSH key not provided"
  exit 1;
fi

if [ "$VERSION" =  "" ]; then
  echo "Image version not provided"
  exit 1;
fi

if [ "$1" =  "" ]; then
  echo "Dockerfile not provided"
  exit 1;
fi

docker build -t wiltsig/fishquest:$VERSION $1
docker push wiltsig/fishquest:$VERSION
ssh -v -i $KEY ubuntu@api.fishquest.net "cd fishquest && sudo docker-compose pull && docker-compose up -d"
